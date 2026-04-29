#!/bin/bash

# Configuration
QSTASH_TOKEN=$1
HEALTH_CHECK_URL="https://eltes.onrender.com/health"
CRON_SCHEDULE="*/14 * * * *"

if [ -z "$QSTASH_TOKEN" ]; then
  echo "Usage: ./scripts/setup-qstash.sh <QSTASH_TOKEN>"
  exit 1
fi

echo "Creating QStash schedule for $HEALTH_CHECK_URL..."

curl -XPOST \
    -H "Authorization: Bearer $QSTASH_TOKEN" \
    -H "Upstash-Cron: $CRON_SCHEDULE" \
    -H "Upstash-Method: GET" \
    "https://qstash.upstash.io/v2/schedules/$HEALTH_CHECK_URL"

echo -e "\nDone!"
