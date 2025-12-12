docker compose up -d db

cp .env.example .env

npm intall

cd apps/api

cp .env.example .env
npm install

npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio

cd ../..
turbo dev
