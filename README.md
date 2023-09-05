# DNSUpdateIP

Allows you to change the type A IP address of a DNS to avoid using DynDNS or CNAME flattening.


## Deployment

1. On your Cloudflare dashboard, create a new Workers and put the code that is in `workers.js`. Don’t forget to complete it!
  * YOUR_SECRET_TOKEN : A secret token that you keep to yourself.
  * YOUR_ZONE_ID : This is the unique identifier of the zone (domain) on Cloudflare.
  * YOUR_DNS_RECORD_ID : This is the unique identifier of the DNS record you want to update.
  * YOUR_API_TOKEN : The API Token of your user account that has rights to your domain.
  * YOUR_DOMAIN_OR_SUBDOMAIN : The name of your domain (example.com) or a subdomain (sub.exemple.com).
2. Modify the script by putting the right domain name where your Workers is located and put the right secret token. 
  * The code will be executed every 5 minutes, you can change it on line 9. (This is in seconds)
3. Now you can mount the image with the dockerfile:
```bash
  docker build -t DNSUpdateIP .
```
4. And finally, you can start a container with the following command:
```bash
  docker run DNSUpdateIP
```
## FAQ

#### Why did I create this code?

My ISP only provides me with a dynamic IP address and knowing that I own a few servers, I needed to have a bot that automatically changes the IP address in the DNS of my domain.

#### Why didn't I put a CNAME type DDNS address instead?

I didn’t want to have the Cloudflare alert telling me that CNAME records cannot be created at the apex of the domain.
