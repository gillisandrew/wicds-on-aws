import { CfnOutput, CfnParameter, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { BlockDevice, BlockDeviceVolume, CfnInstance, CloudFormationInit, GatewayVpcEndpointAwsService, IInstance, InitCommand, InitConfig, InitFile, InitPackage, InitSource, InitUser, Instance, InstanceClass, InstanceSize, InstanceType, ISecurityGroup, IVpc, MachineImage, OperatingSystemType, Peer, Port, SecurityGroup, SubnetType, UserData, Vpc } from 'aws-cdk-lib/aws-ec2';
import { IRole, ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import configs from './InitConfig';

import install_cfn from './InitConfig/enable_cfn';


export class WICDSStack extends Stack {
  protected _role?: IRole
  protected _vpc?: IVpc
  protected _securityGroup?: ISecurityGroup
  protected _userData?: UserData
  protected _init?: CloudFormationInit
  protected instance: Instance
  protected bucket: Bucket

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const { role, vpc, securityGroup, userData } = this;
    const { keyName, instanceSize, instanceClass } = this.parameters()

    this.vpc.addGatewayEndpoint('s3', {
      service: GatewayVpcEndpointAwsService.S3
    })


    this.instance = new Instance(this, 'Instance', {
      machineImage: MachineImage.lookup({
        name: 'ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*',
        owners: ['099720109477']
      }),
      instanceType: InstanceType.of(instanceClass, instanceSize),
      vpc,
      keyName,
      securityGroup,
      blockDevices: [{
        deviceName: '/dev/sda1',
        volume: BlockDeviceVolume.ebs(16)
      }],
      role,
      userData,
      userDataCausesReplacement: false
    })
    this.node.defaultChild = this.instance.node.defaultChild

    this.init.attach(this.instance.node.defaultChild as CfnInstance, {
      configSets: ['setup'],
      userData,
      embedFingerprint: false,
      instanceRole: this.instance.role,
      platform: this.instance.osType,
      ignoreFailures: true // TODO
    });

    (this.instance.node.defaultChild as CfnInstance)
      .cfnOptions.creationPolicy = {
        resourceSignal: {
          count: 1,
          timeout: 'PT30M'
        }
      }

    this.outputs()
  }

  get init() {
    this._init = this._init ?? CloudFormationInit.fromConfigSets({
      configSets: {
        setup: [
          'enable_cfn',
          'add_wine_repo',
          'install_wine',
          'install_wicds',
          'add_utils',
        ],
        default: [
          'add_utils',
        ]
      },
      configs: configs(this)
    })

    return this._init
  }
  
  get userData() {
    this._userData = this._userData ?? ((ud) => {
      ud.addCommands(
        'apt-get -o DPkg::Lock::Timeout=120 update -y',
        'apt-get -o DPkg::Lock::Timeout=120 install -y python3-pip',
        'pip3 install https://s3.amazonaws.com/cloudformation-examples/aws-cfn-bootstrap-py3-latest.tar.gz',
        'mkdir -p /opt/aws/bin',
        'ln -s /usr/local/bin/cfn-*  /opt/aws/bin/',
      )
      return ud
    })(UserData.forLinux())

    return this._userData
  }

  get role() {
    this._role = this._role ?? new Role(this, 'Role', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
        ManagedPolicy.fromAwsManagedPolicyName('CloudWatchAgentServerPolicy'),
      ]
    })

    return this._role
  }

  get vpc() {
    this._vpc = this._vpc ?? new Vpc(this, 'Vpc', {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      maxAzs: 2,
      subnetConfiguration: [{
        name: 'PublicA',
        subnetType: SubnetType.PUBLIC,
        cidrMask: 24
      },{
        name: 'PublicB',
        subnetType: SubnetType.PUBLIC,
        cidrMask: 24
      }]
    })

    return this._vpc
  }

  get securityGroup() {
    this._securityGroup = this._securityGroup ?? ((sg) => {
      sg.addIngressRule(Peer.anyIpv4(), Port.allIcmp())
      sg.addIngressRule(Peer.anyIpv4(), Port.tcp(3004))
      sg.addIngressRule(Peer.anyIpv4(), Port.udp(22996))
      sg.addIngressRule(Peer.anyIpv4(), Port.udp(22993))
      sg.addIngressRule(Peer.anyIpv4(), Port.udpRange(48000, 48999))
      sg.addIngressRule(Peer.anyIpv4(), Port.tcpRange(48000, 48999))
      sg.addIngressRule(Peer.anyIpv4(), Port.udpRange(52000, 52999))
      sg.addIngressRule(Peer.anyIpv4(), Port.tcpRange(52000, 52999))
      return sg
    })(new SecurityGroup(this, 'SecurityGroup', {
      vpc: this.vpc,
      allowAllOutbound: true
    }))

    return this._securityGroup
  }

  private outputs() {
    new CfnOutput(this, 'InstanceId', {
      value: this.instance.instanceId,
    })
  }

  private parameters() {
    return {
      keyName: (new CfnParameter(this, 'KeyName', {
        description: 'Key pair name used to secure the server',
        type: 'String',
        default: 'wicds-key-pair'
      })).valueAsString,
      instanceSize: (new CfnParameter(this, 'InstanceSize', {
        description: 'Instance size of the server',
        type: 'String',
        allowedValues: Object.values(InstanceSize),
        default: InstanceSize.MICRO,
      })).valueAsString as InstanceSize,
      instanceClass: (new CfnParameter(this, 'InstanceClass', {
        description: 'Instance class of the server',
        type: 'String',
        allowedValues: Object.values(InstanceClass),
        default: InstanceClass.T3,
      })).valueAsString as InstanceClass
    }
  }
}
