# BookNook

BookNook is a small online library where readers can share books, borrow an
available copy for seven days, and return it to the community shelf.

**Live site:** `https://YOUR-DEPLOYED-BOOKNOOK-URL.vercel.app`
Replace this placeholder with the public URL after deploying the client.

## Features

- Browse, search, filter, and sort the shared book collection.
- See the newest additions and book availability before borrowing.
- Create an account with email and password or sign in with Google.
- Add and edit books, upload cover images to ImgBB, and remove your own books.
- Borrow available copies for seven days and return them from your account.
- Track active copies so books cannot be over-borrowed or borrowed twice by
  the same reader at once.
- Use a responsive interface with light and dark themes.

## Project repositories

- Client: this Next.js repository.
- API: the separate `book-nook-server` Express and MongoDB repository.

## Run locally

Start the API first. In the backend repository, copy `.env.example` to `.env`,
fill in `MONGODB_URI`, and run:

```bash
npm install
npm run dev
```

In this repository, copy `.env.example` to `.env.local`, configure the values
below, and run:

```bash
npm install
npm run dev
```

The client runs at `http://localhost:3000`; the API runs at
`http://localhost:8000`.

### Client environment

- `NEXT_PUBLIC_API_URL` — Express API origin.
- `MONGODB_URI` — MongoDB connection string used by Better Auth and profiles.
- `BETTER_AUTH_URL` and `BETTER_AUTH_SECRET` — Better Auth public URL and
  secret.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — optional Google OAuth
  credentials.
- `IMGBB_API_KEY` — server-only key for book cover uploads.

Set `CLIENT_URL` and `BETTER_AUTH_URL` in the API environment to the client
origin. For production, configure the deployed client and API URLs in both
hosting providers, and add the production Google OAuth callback URL:
`https://YOUR-CLIENT-DOMAIN/api/auth/callback/google`.

Profile photo uploads accept JPG, PNG, and WebP files up to 4 MB and are stored
in the configured MongoDB database. Book covers are uploaded to ImgBB.

## Deploy

Deploy the client to Vercel and the API to Vercel or Render. Configure the
environment variables above in each hosting provider before publishing. Replace
the live-site placeholder at the top of this README with the deployed client
URL.
