# World in Conflict - Dedicated Server on AWS

## Prerequisites
- An AWS account.
- AWS CLI with your admin credentials configured
- NodeJS
## Installation
```bash
npm ci
export AWS_REGION="us-east-1" # Ensure you are operating in your selected region
aws ec2 import-key-pair --key-name wicds-key-pair --public-key-material fileb://~/.ssh/id_rsa.pub # Import your SSH key pair
cp config.example.yaml config.yaml # Create the WICDS config file. 
npm run bootstrap # Run once per AWS region you are deploying to.
npm run deploy # Update the keyname to your installed
```

## Tasks
- [ ] Investigate graceful shutdown issue
- [ ] Insert admin password into config at runtime
- [ ] Add `lighttpd` server to deliver server banners
- [ ] Programatically generate server banners
- [ ] Research runtime arguments for wic_ds.exe
- [ ] Inquire about ranked server requirements
- [ ] Add helper to securely connect to the telnet admin shell