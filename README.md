# DNSUpdateIP

Allows you to change the type A IP address of a DNS to avoid using DynDNS or CNAME flattening.

## Deployment

1. The image is available on [Docker](https://hub.docker.com/r/bysimeit/dnsupdateip). You can pull it with the following command:
```bash
  docker pull bysimeit/dnsupdateip
```
2. After pulling the image, you can either create a container with docker-compose or docker cli. Below you will find examples of how to use: 
  * ### docker-compose
```yml
version: '3'

services:
  dnsupdateip:
    image: bysimeit/dnsupdateip
    container_name: dnsupdateip
    environment:
      SECRET_TOKEN: "MY_PASSWORD"
      ZONE_ID: "ZONE_ID"
      DNS_RECORD_ID: "DNS_RECORD_ID"
      API_TOKEN: "API_TOKEN"
      DOMAIN: "example.be"
      TTL: "120" # Optional
      IS_PROXIED: "false" # Optional
    ports:
      - "80:80"
    restart: unless-stopped
```
  * ### docker cli
```bash
docker run -d \
  --name=dnsupdateip \
  -e SECRET_TOKEN="MY_PASSWORD" \
  -e ZONE_ID="ZONE_ID" \
  -e DNS_RECORD_ID="DNS_RECORD_ID" \
  -e API_TOKEN="API_TOKEN" \
  -e DOMAIN="example.be" \
  -e TTL="120" `#optional` \
  -e IS_PROXIED="true" `#optional` \
  -p 80:80 \
  --restart unless-stopped \
  bysimeit/dnsupdateip
```

## Parameters

There are seven parameters, two of which are optional. Below are the details of each parameter:

| Parameter | Function |
| :----: | --- |
| `SECRET_TOKEN` | You must put a password that you will keep for yourself. |
| `ZONE_ID` | The unique identifier of the zone (domain) on Cloudflare. The Zone ID is in the overview of your domain. It is usually on the right side of the page. |
| `DNS_RECORD_ID` | The unique identifier of the DNS record you want to update. You can find it with this command: `curl -X GET "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/dns_records" -H "Authorization: Bearer YOUR_API_TOKEN" -H "Content-Type: application/json"` |
| `API_TOKEN` | The API Token of your user account that has rights to your domain. |
| `DOMAIN` | The name of your domain (example.com) or a subdomain (sub.exemple.com). |
| `TTL` | **[Optional]** Time a DNS record is considered valid by cache systems. |
| `IS_PROXIED` | **[Optional]** Enable or disable Cloudflare proxy status for DNS record |

## FAQ

#### Why did I create this code?

My ISP only provides me with a dynamic IP address and knowing that I own a few servers, I needed to have a bot that automatically changes the IP address in the DNS of my domain.

#### Why didn't I put a CNAME type DDNS address instead?

I didn’t want to have the Cloudflare alert telling me that CNAME records cannot be created at the apex of the domain.
