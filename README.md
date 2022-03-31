# World in Conflict - Dedicated Server on AWS

## Prerequisites

- An [AWS](https://aws.amazon.com/) account.
- [AWS CLI](https://aws.amazon.com/cli/) with your [credentials configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html).
- A recent version of [NodeJS](https://nodejs.org/en/)

## Installation

```bash
# 1. Install dependencies.
npm ci
# 2. Ensure you are operating in your selected AWS region
export AWS_REGION="us-east-1"
# 3. Create the WICDS config file.
#    Update this file as appropriate. Add more instances.
#    Even a "t3.micro" ec2 instance can handle up to 5 running wicds instances.
cp config.example.yaml config.yaml
# 4. Run once per AWS region you are deploying to.
npm run bootstrap
# 5. Deploy the stack.
npm run deploy
```

## Management

## Tasks

- [ ] Investigate graceful shutdown issue
- [ ] Add `lighttpd` server to deliver server banners
- [ ] Programatically generate server banners
- [ ] Research runtime arguments for wic_ds.exe
- [ ] Inquire about ranked server requirements
- [ ] Add helper to securely connect to the telnet admin shell
