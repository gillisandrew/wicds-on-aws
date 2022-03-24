import { CfnParameter, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { CfnInstance, CloudFormationInit, IInstance, InitCommand, InitConfig, InitFile, InitPackage, InitSource, Instance, InstanceClass, InstanceSize, InstanceType, ISecurityGroup, IVpc, MachineImage, Peer, Port, SecurityGroup, UserData, Vpc } from 'aws-cdk-lib/aws-ec2';
import { IRole, ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class WICDSStack extends Stack {
  protected _role?: IRole
  protected _vpc?: IVpc
  protected _securityGroup?: ISecurityGroup
  protected _userData?: UserData
  protected _init?: CloudFormationInit
  protected instance: Instance

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const { role, vpc, securityGroup, init, userData } = this;

    this.instance =  new Instance(this, 'Instance', {
      machineImage: MachineImage.lookup({
        name: 'ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*',
        owners: ['099720109477']
      }),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.SMALL),
      vpc,
      keyName: (new CfnParameter(this, 'KeyPair', {
        description: 'KeyPair used to secure the server',
        type: 'String'
        })).valueAsString,
      securityGroup,
      init,
      initOptions: {
        configSets: ['setup'],
        timeout: Duration.minutes(30),
        embedFingerprint: false,
      },
      role,
      userData
    })
    this.instance.addUserData(
      `mkdir -p /etc/cfn/hooks.d && cat << EOF > /etc/cfn/hooks.d/cfn-auto-reloader.conf
[cfn-auto-reloader-hook]
triggers=post.update
path=Resources.${(this.instance.node.defaultChild as CfnInstance).logicalId}.Metadata.AWS::CloudFormation::Init
action=/opt/aws/bin/cfn-init -v --stack ${Stack.of(this).stackName} --resource ${(this.instance.node.defaultChild as CfnInstance).logicalId} --configsets default --region ${Stack.of(this).region}
runas=root
EOF
`)
    this.instance.addUserData(`systemctl restart cfn-hup.service`)
  }

  get init() {
    this._init = this._init ?? CloudFormationInit.fromConfigSets({
      configSets: {
        setup: [
          'install_cfn',
          'add_utils',
          'add_wine_repo',
          'install_wine',
          'download_wicds',
        ],
        default: [
          'add_utils',
        ]
      },
      configs: {
        'install_cfn': new InitConfig([
          InitFile.fromString('/etc/cfn/cfn-hup.conf', `[main]
stack=${Stack.of(this).stackId}
region=${Stack.of(this).region}
interval=1
`,
          {
            mode: '000400'
          }),
          InitFile.fromString('/lib/systemd/system/cfn-hup.service', `[Unit]
Description=cfn-hup daemon

[Service]
Type=simple
ExecStart=/opt/aws/bin/cfn-hup
Restart=always

[Install]
WantedBy=multi-user.target
`),
          InitCommand.shellCommand('systemctl enable cfn-hup.service'),
          InitCommand.shellCommand('systemctl start cfn-hup.service'),
        ]),
        'add_utils': new InitConfig([
          InitFile.fromAsset('/usr/local/bin/download-mono', './utils/download-mono', { mode: '000755' }),
          InitFile.fromAsset('/usr/local/bin/wicds', './utils/wicds', { mode: '000755' }),
          InitSource.fromAsset('/etc/wicds', './config')
         ]),
        'add_wine_repo': new InitConfig([
          InitCommand.shellCommand(`#!/usr/bin/env bash
wget -nv -O- https://dl.winehq.org/wine-builds/winehq.key | APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1 apt-key add -
echo "deb https://dl.winehq.org/wine-builds/ubuntu/ $(grep VERSION_CODENAME= /etc/os-release | cut -d= -f2) main" >> /etc/apt/sources.list
dpkg --add-architecture i386
apt-get update -y
`
          )]),
        'install_wine': new InitConfig([
          InitPackage.apt('winehq-stable'),
          InitCommand.shellCommand(`#!/usr/bin/env bash
download-mono "$(wine --version | sed -E \'s/^wine-//\')" 
`)
        ]),
        'download_wicds': new InitConfig([
          InitPackage.apt('unzip'),
          InitFile.fromUrl('/usr/local/src/wicds_step_1.exe', 'https://www.massgate.org/files/wic_server_1010.exe'),
          InitFile.fromUrl('/usr/local/src/wicds_step_2.exe', 'https://www.massgate.org/files/wic_server_update_1010_to_1011.exe'),
          InitFile.fromUrl('/usr/local/src/wicds_step_3.zip', 'https://www.massgate.org/files/wic_server_patch_beta.zip'),
          InitFile.fromUrl('/usr/local/src/wicds_maps.zip', 'https://www.massgate.org/files/maps/map_pack.zip')
        ])
      }
    })

    return this._init
  }
  get userData() {
    this._userData = this._userData ?? ((ud) => {
      ud.addCommands(
        'apt-get update -y',
        'apt-get install python2.7 -y',
        'curl https://bootstrap.pypa.io/pip/2.7/get-pip.py --output get-pip.py',
        'python2.7 get-pip.py',
        'pip2 install https://s3.amazonaws.com/cloudformation-examples/aws-cfn-bootstrap-latest.tar.gz',
        'mkdir -p /opt/aws/bin',
        'ln -s /usr/local/bin/cfn-*  /opt/aws/bin/'
      )
      return ud
    })(UserData.forLinux({ shebang: '#!/usr/bin/env bash' }))

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
    this._vpc = this._vpc ?? Vpc.fromLookup(this, 'DefaultVpc', {
      isDefault: true
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
}
