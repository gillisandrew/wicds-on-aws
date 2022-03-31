import { Aws, CfnOutput, CfnParameter, Fn, Stack, StackProps } from 'aws-cdk-lib';
import { BlockDeviceVolume, CfnInstance, CfnPrefixList, CloudFormationInit, GatewayVpcEndpointAwsService, Instance, InstanceClass, InstanceSize, InstanceType, ISecurityGroup, IVpc, MachineImage, Peer, Port, SecurityGroup, SubnetType, UserData, Vpc } from 'aws-cdk-lib/aws-ec2';
import { IRole, ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as crypto from 'crypto';
import configs from './InitConfig';
export class WICDSStack extends Stack {
  public deployment: string
  protected _role?: IRole
  protected _vpc?: IVpc
  protected _securityGroup?: ISecurityGroup
  protected _userData?: UserData
  protected _init?: CloudFormationInit
  protected _ec2ConnectPrefixList: CfnPrefixList
  protected instance: Instance
  protected bucket: Bucket
  protected _parameters: {[key: string]: any}
  private _conditions: any;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.deployment = this.node.tryGetContext('deployment');
    this.node.setContext('hash', this.deployment);

    const { role, vpc, securityGroup, userData } = this;
    const { instanceSize, instanceClass } = this.parameters

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
      securityGroup,
      blockDevices: [{
        deviceName: '/dev/sda1',
        volume: BlockDeviceVolume.ebs(16)
      }],
      role,
      userData,
      userDataCausesReplacement: true
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

    this.addCreationPolicy(this.instance)

    this.outputs()
  }

  get ec2ConnectPrefixList() {
    this._ec2ConnectPrefixList = this._ec2ConnectPrefixList ?? new CfnPrefixList(this, 'EC2ConnectPrefixList', {
      prefixListName: `com.wicds.global.ec2-connect`,
      addressFamily: 'IPv4',
      maxEntries: 20,
      entries: [
        '18.252.4.0/30',
        '15.200.28.80/30',
        '13.244.121.196/30',
        '3.112.23.0/29',
        '13.209.1.56/29',
        '13.233.177.0/29',
        '3.0.5.32/29',
        '13.239.158.0/29',
        '35.183.92.176/29',
        '3.120.181.40/29',
        '13.48.4.200/30',
        '15.161.135.164/30',
        '18.202.216.48/29',
        '3.8.37.24/29',
        '35.180.112.80/29',
        '18.228.70.32/29',
        '18.206.107.24/29',
        '3.16.146.0/29',
        '13.52.6.112/29',
        '18.237.140.160/29',
      ].map((cidr) => ({
        cidr
      }))
    })
    return this._ec2ConnectPrefixList
  }

  get init() {
    this._init = this._init ?? CloudFormationInit.fromConfigSets({
      configSets: {
        setup: [
          'setup_environment',
          'enable_cfn',
          'add_wine_repo',
          'install_wine',
          'install_wicds',
          'install_instances',
        ],
        default: [
          'install_instances',
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
        `# HASH ${this.hash(this.deployment)}`,
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
      sg.addIngressRule(Peer.prefixList(this.ec2ConnectPrefixList.getAtt('PrefixListId').toString() as string), Port.tcp(22))
      return sg
    })(new SecurityGroup(this, 'SecurityGroup', {
      vpc: this.vpc,
      allowAllOutbound: true
    }))

    return this._securityGroup
  }

  private addCreationPolicy(instance: Instance) {
    const cfnInstance = instance.node.defaultChild as CfnInstance
    cfnInstance.cfnOptions.creationPolicy = {
      resourceSignal: {
        count: 1,
        timeout: 'PT30M',
      }
    }
  }

  private hash(value: any) {
    const md5 = crypto.createHash('md5')
    md5.update(JSON.stringify(value))
    return md5.digest('hex')
  }

  private outputs() {
    new CfnOutput(this, 'InstanceId', {
      value: this.instance.instanceId,
    })
    new CfnOutput(this, 'EC2InstanceConnectURL', {
      value: Fn.join('', [
        `https://${Aws.REGION}.console.aws.amazon.com/ec2/v2/connect/ubuntu/`,
        this.instance.instanceId
      ])
    })
  }
  get conditions() {
    this._conditions = this._conditions ?? {
     
    }
    return this._conditions
  }

  get parameters() {
    this._parameters = this._parameters ?? {
      // hash: (new CfnParameter(this, 'Hash', {
      //   description: 'Value used to force reprovisioning the instance',
      //   type: 'String',
      //   default: 'none'
      // })).valueAsString,
      // keyName: (new CfnParameter(this, 'KeyName', {
      //   description: 'Key pair name used to secure the server',
      //   type: 'String',
      //   default: ''
      // })).valueAsString,
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
    return this._parameters
  }
}
