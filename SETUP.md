docker compose up -d db

cp .env.example .env

npm install

cd apps/api

cp .env.example .env
npm install

npm run prisma:generate
npm run prisma:migrate
#npm run prisma:studio

cd ../..

npx create-turbo@latest

turbo dev
