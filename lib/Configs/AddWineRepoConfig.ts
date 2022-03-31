import {
  InitCommand, InitConfig,
} from 'aws-cdk-lib/aws-ec2';

export default () => new InitConfig([
  InitCommand.shellCommand('wget -nv -O- https://dl.winehq.org/wine-builds/winehq.key | APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1 apt-key add -'),
  InitCommand.shellCommand('echo "deb https://dl.winehq.org/wine-builds/ubuntu/ $(grep VERSION_CODENAME= /etc/os-release | cut -d= -f2) main" >> /etc/apt/sources.list'),
  InitCommand.shellCommand('dpkg --add-architecture i386'),
  InitCommand.shellCommand('apt-get update -y'),
]);
