# Setup PM2 process manager to keep your app running
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
- [Full Node.js Deployment - NGINX, SSL With Lets Encrypt](https://www.youtube.com/watch?v=oykl1Ih9pMg)