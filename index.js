const express = require('express');
const fetch = require('node-fetch');
const cron = require('node-cron');

const app = express();
const PORT = 80;

const SECRET_TOKEN = process.env.SECRET_TOKEN;
const ZONE_ID = process.env.ZONE_ID;
const DNS_RECORD_ID = process.env.DNS_RECORD_ID;
const API_TOKEN = process.env.API_TOKEN;
const DOMAIN = process.env.DOMAIN;
const TTL = process.env.TTL || 1;
const IS_PROXIED = process.env.IS_PROXIED === 'true';

async function getPublicIP() {
  try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
  } catch (error) {
      console.error('Error while recovering public IP:', error);
      return null;
  }
}

app.get('/', async (req, res) => {
  try {
      const result = await executeCode(req);
      res.status(result.status).send(result.message);
  } catch (error) {
      res.status(500).send('An error has occurred.');
  }
});

const executeCode = async (req) => {
    const token = req.query.token;

    const publicIP = await getPublicIP();

    if (token !== SECRET_TOKEN) {
        return { status: 401, message: 'Unauthorized' };
    } else {
        const currentIp = req.headers['x-forwarded-for'] || publicIP;
        const API_URL = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${DNS_RECORD_ID}`;
        const HEADERS = {
            "Authorization": `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json"
        };

        const payload = {
            type: "A",
            name: DOMAIN,
            content: currentIp,
            ttl: TTL,
            proxied: IS_PROXIED
        };

        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: HEADERS,
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("Success");
            return { status: 200, message: 'IP Updated' };
        } else {
            console.log("Failed");
            return { status: 500, message: 'Update Failed' };
        }
    }
};

cron.schedule('*/5 * * * *', async () => {
  console.log('Automatic code execution...');
  
  const publicIP = await getPublicIP();
  if (!publicIP) {
      console.error('Cannot retrieve public IP. Cron job abandoned.');
      return;
  }
  
  const newReq = {
      query: { token: SECRET_TOKEN },
      headers: {
          'x-forwarded-for': publicIP
      }
  };

  await executeCode(newReq);
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
