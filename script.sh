#!/bin/sh

WEB_SITE="https://example.com/?token=YOUR_SECRET_TOKEN"

while true; do
    echo "---- $(date) ----" 
    curl -s $WEB_SITE
    echo ""
    sleep 300 # Timer 5 minutes
done
