# Fullstack kanban Trello Board with Media Integration: Next.js 14, Server Actions, React, Prisma, Stripe, Tailwind, MySQL

Key Features:
- Auth 
-Board
-Multimedia

### Prerequisites

**Node version 18.x.x**

### Cloning the repository

```shell
git clone 
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=

DATABASE_URL=

NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=

STRIPE_API_KEY=

NEXT_PUBLIC_APP_URL=

STRIPE_WEBHOOK_SECRET=
```

### Setup Prisma

Add MySQL Database 

```shell
npx prisma generate
npx prisma db push

```

### Start the app

```shell
npm run dev
```

