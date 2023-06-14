# Table of contents
- [Set Up SSH Keys](#set-up-ssh-keys)
  - [Creating the Key Pair](#creating-the-key-pair)
  - [Copying the Public Key to Your Ubuntu Server](#copying-the-public-key-to-your-ubuntu-server)
    - [Copying the Public Key Manually](#copying-the-public-key-manually)
  - [Disabling Password Authentication on Your Server](#disabling-password-authentication-on-your-server)
- [Setup PM2](#setup-pm2)
- [Enable firewall](#enable-firewall)
- [Setup NGINX](#setup-nginx)
- [Reference](#reference)

# Set Up SSH Keys
## Creating the Key Pair
- `ssh-keygen` or `ssh-keygen -f <filename>`

## Copying the Public Key to Your Ubuntu Server
### Copying the Public Key Manually
We will manually append the content of your `id_rsa.pub` file to the `~/.ssh/authorized_keys` file on your remote machine.
```bash
cat ~/.ssh/id_rsa.pub
```
Once you have access to your account on the remote server
```bash
mkdir -p ~/.ssh
echo public_key_string >> ~/.ssh/authorized_keys
chmod -R go= ~/.ssh
```

## Disabling Password Authentication on Your Server
Once you’ve confirmed that your remote account has administrative privileges, log into your remote server with SSH keys, either as **root** or with an account with `sudo` privileges. Then, open up the SSH daemon’s configuration file:
```bash
sudo nano /etc/ssh/sshd_config
```

Inside the file, search for a directive called `PasswordAuthentication`. This line may be commented out with a `#` at the beginning of the line. Uncomment the line by removing the `#`, and set the value to `no`. This will disable your ability to log in via SSH using account passwords:
```
. . .
PasswordAuthentication no
. . .
```

Save and close the file when you are finished by pressing CTRL+X, then Y to confirm saving the file, and finally ENTER to exit nano. To actually activate these changes, we need to restart the sshd service:
```bash
sudo systemctl restart ssh
```

# Setup PM2
PM2 is a Production Process Manager for Node.js applications with a built-in Load Balancer.  
It allows you to keep applications alive forever, to reload them without downtime and facilitate common Devops tasks.
- `sudo npm i pm2 -g`: install pm2
- `pm2 start index.js`: start application
- Other pm2 commands
  ```bash
    pm2 show app
    pm2 status
    pm2 restart app
    pm2 stop app
    pm2 logs # Show log stream
    pm2 flush # Clear logs
  ```
- `pm2 startup ubuntu`: To make sure app starts when reboot

# Enable firewall
- `ufw status`: check firewall status
- `ufw enable`: enable firewall
- `ufw allow ssh`: allow ssh in firewall
- `ufw allow http`: allow http in firewall
- `ufw allow https`: allow https in firewall

# Setup NGINX
Set up NGINX so that we can access our application with just IP
- `sudo apt install nginx`: install NGINX
- `sudo nano /etc/nginx/sites-available/default`: update NGINX
  ```bash
   server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000; #whatever port your app runs on
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
  ```
- `sudo nginx -t`: check NGINX config
- `sudo service nginx restart`: restart NGINX

You should now be able to visit your IP with no port (port 80) and see your app. Now let's add a domain

# Reference
- [How to Set Up SSH Keys on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04)
- [Full Node.js Deployment - NGINX, SSL With Lets Encrypt](https://www.youtube.com/watch?v=oykl1Ih9pMg)