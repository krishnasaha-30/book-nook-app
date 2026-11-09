# BookNook

BookNook is a community-powered online library. Readers can share books they
own, borrow available copies for seven days, and return them for other readers
to enjoy.

**Live site:** [book-nook-app-two.vercel.app](https://book-nook-app-two.vercel.app)

## Features

- Browse the community shelf, search by title or author, filter by category,
  and sort by newest or oldest.
- View book details and availability, including the newest additions.
- Register with email and password or sign in with Google when OAuth is
  configured.
- Add, edit, and remove your own book listings.
- Upload book covers to ImgBB and manage a profile photo.
- Borrow available copies for seven days, then return them from your account.
- Track your own listings and active or returned borrows.
- Use the responsive interface with light and dark themes.

## Application structure

This repository contains the BookNook web client, built with Next.js, React,
TypeScript, and Tailwind CSS. The client uses:

- **Better Auth** for email/password and optional Google authentication.
- **MongoDB** for authentication data and profile photos.
- A separate **Express API** for book listings and borrowing operations.
- **ImgBB** for uploaded book cover images.

The Express API is maintained separately in the `book-nook-server` repository.
The web client and API must both be configured for a complete local or
production deployment.

## Getting started

### Prerequisites

- Node.js and npm.
- A MongoDB instance, local or hosted.
- The BookNook Express API repository, running locally or deployed.
- An ImgBB API key to enable book cover uploads.

Google OAuth credentials are optional; email/password authentication works
without them.

### Configure the web client

Create a `.env.local` file in the project root:

```dotenv
# Express API origin
NEXT_PUBLIC_API_URL=http://localhost:8000

# MongoDB used by Better Auth and profile photos
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=booknook

# Public URL of this Next.js app and a long, random secret
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=replace-with-a-long-random-secret

# Optional: enable Google sign-in by setting both values
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Required only for book cover uploads
IMGBB_API_KEY=
```

`DB_NAME` defaults to `booknook` if omitted. Keep secrets such as
`BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_SECRET`, and `IMGBB_API_KEY` private; do
not add them to source control.

### Run locally

Start and configure the Express API using the instructions in its repository.
By default, the client expects it at `http://localhost:8000`.

In this repository, install dependencies and start the Next.js development
server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Keep the API and web client
running in separate terminals. If the API uses a different address, update
`NEXT_PUBLIC_API_URL` and restart the client.

## Application pages

| Route | Description |
| --- | --- |
| `/` | Home page, including new arrivals and an introduction to borrowing |
| `/books` | Search and browse the shared book collection |
| `/books/[id]` | Book details and borrowing availability |
| `/login` | Sign in |
| `/register` | Create an account |
| `/add-book` | Add a book listing (requires sign-in) |
| `/my-books` | Manage your book listings (requires sign-in) |
| `/my-books/[id]/edit` | Edit one of your listings (requires sign-in) |
| `/my-borrows` | View and return borrowed books (requires sign-in) |
| `/profile` | Manage your profile (requires sign-in) |

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | No | Base URL of the Express API. Defaults to `http://localhost:8000`; set it when the API is hosted elsewhere. |
| `MONGODB_URI` | Yes | MongoDB connection string for Better Auth and profile photos. |
| `DB_NAME` | No | MongoDB database name. Defaults to `booknook`. |
| `BETTER_AUTH_URL` | No locally; set in deployment | Base URL of this Next.js app; defaults to `http://localhost:3000` in the auth configuration. |
| `BETTER_AUTH_SECRET` | Yes | Secret used by Better Auth. Use a strong, unique value. |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID. Set it together with the client secret to enable Google sign-in. |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret. |
| `IMGBB_API_KEY` | For cover uploads | Server-side ImgBB key used to upload book covers. |

The API has its own environment configuration; follow the server repository's
instructions and set its allowed client origin and authentication integration
to match this app. When Google sign-in is enabled, configure the OAuth
credentials for the relevant environment and allow the callback URL
`https://<your-client-domain>/api/auth/callback/google`.

Profile photos accept JPG, PNG, and WebP files up to 4 MB and are stored in
MongoDB. Book covers accept JPG, PNG, and WebP files up to 10 MB and are hosted
by ImgBB.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Deployment

Deploy this Next.js app (for example, to Vercel) and deploy the Express API
separately. Configure the production environment variables for both services:

- Set `NEXT_PUBLIC_API_URL` to the deployed API origin.
- Set `BETTER_AUTH_URL` to the public client origin and provide a secure
  `BETTER_AUTH_SECRET`.
- Configure `MONGODB_URI` and, if needed, `DB_NAME` for the production database.
- Configure the API's client origin and authentication integration according
  to the server's deployment instructions.
- Add `IMGBB_API_KEY` to enable cover uploads and the Google OAuth credentials
  if Google sign-in is desired.
- For Google OAuth, register the deployed callback URL shown above.

Never expose server-side secrets through `NEXT_PUBLIC_` variables or commit
production credentials to the repository.
