#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
docker compose up -d mongo
cd server
[ -f .env ] || cp .env.example .env
npm install
ID=$(npm run seed 2>&1 | tee /tmp/feedants-seed.log | sed -n 's/Seeded competition: //p' | tail -1)
cd ../mobile
[ -f .env ] || cp .env.example .env
if [ -n "$ID" ]; then echo "EXPO_PUBLIC_COMPETITION_ID=$ID" >> .env; fi
npm install
printf '\nSetup complete. Start backend: cd server && npm run dev\nStart mobile: cd mobile && npx expo start\n'
