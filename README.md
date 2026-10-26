# Plaintext

Plaintext is a full-stack community application for writing, publishing, and
discovering programming and computing posts. The repository contains a Laravel
JSON API and a React single-page application.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Repository layout](#repository-layout)
- [Requirements](#requirements)
- [Local development setup](#local-development-setup)
- [Environment configuration](#environment-configuration)
- [Database and seed data](#database-and-seed-data)
- [Application routes](#application-routes)
- [API overview](#api-overview)
- [Image uploads](#image-uploads)
- [Development commands](#development-commands)
- [Troubleshooting](#troubleshooting)

## Features

- Browse the published post feed and filter it by category.
- View post details, likes, and comments.
- Register, sign in, and sign out.
- Create posts, save drafts, publish, edit, and delete your own posts.
- Upload or remove post cover images through Cloudinary.
- Manage published posts and drafts from the profile.
- Browse posts you have liked.
- Paginate post feeds and user post collections.

## Technology

| Area                  | Main technologies                                                      |
| --------------------- | ---------------------------------------------------------------------- |
| API                   | PHP 8.3+, Laravel 13, Eloquent, Pest                                   |
| Frontend              | React 19, TypeScript, Vite 8                                           |
| Client data and forms | TanStack Query, Axios, React Hook Form, Zod                            |
| UI                    | Tailwind CSS 4, Base UI, Lucide                                        |
| Database              | SQLite by default; other Laravel-supported databases can be configured |
| Image storage         | Cloudinary signed Upload API                                           |

The API dependency versions are defined in [`api/composer.json`](api/composer.json)
and [`api/composer.lock`](api/composer.lock). Frontend dependencies and scripts
are defined in [`web/package.json`](web/package.json) and
[`web/package-lock.json`](web/package-lock.json).

## Repository layout

```text
.
├── api/
│   ├── app/
│   │   ├── Http/                 # Controllers, requests, resources, middleware
│   │   ├── Models/               # Eloquent models
│   │   ├── Policies/             # Authorization policies
│   │   └── Services/             # Integrations, including Cloudinary
│   ├── database/
│   │   ├── factories/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/                   # API, web, auth, and console routes
│   └── tests/                    # Pest tests
└── web/
    └── src/
        ├── components/           # Shared and feature UI
        ├── features/             # API clients, schemas, hooks, and types
        ├── layouts/
        ├── pages/
        ├── routes/
        └── utils/
```

The browser application calls the Laravel API through the Axios client. API
requests and response types live under `web/src/features`; Laravel owns
validation, authorization, persistence, pagination, and API responses.

## Requirements

- PHP 8.3 or newer and Composer.
- A PHP database driver for the configured database. SQLite is the default.
- Node.js and npm compatible with the versions of Vite and its plugins in the
  frontend lockfile.
- Cloudinary credentials if you want to upload post images.

## Local development setup

Use two terminals: one for Laravel and one for Vite.

### 1. Install and configure the API

In PowerShell:

```powershell
Set-Location api
composer install
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
}
php artisan key:generate
```

Review `api/.env` before continuing. Its default database connection is SQLite,
using `api/database/database.sqlite`. Create the file if it does not exist:

```powershell
if (-not (Test-Path database/database.sqlite)) {
    New-Item -ItemType File -Path database/database.sqlite | Out-Null
}
```

Apply migrations:

```powershell
php artisan migrate
```

Optionally seed local development data as described in
[Database and seed data](#database-and-seed-data).

Start the API from the `api` directory:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

The local API base URL is `http://127.0.0.1:8000/api`; its health endpoint is
`http://127.0.0.1:8000/up`.

### 2. Install and configure the frontend

In a second terminal:

```powershell
Set-Location web
npm ci
```

The frontend reads its settings from `web/.env`. Create or update the file with
the following keys, adapting the production API URL if needed:

```dotenv
VITE_ENVIRONMENT=development
VITE_AUTH_TOKEN_NAME=dojo_auth_token
VITE_DEV_API_URL=http://127.0.0.1:8000/api
VITE_API_URL=https://your-production-api.example.com/api
```

`VITE_ENVIRONMENT=development` selects `VITE_DEV_API_URL`. Setting it to
`production` selects `VITE_API_URL`. The auth token key is the local-storage
key used by the frontend to read the API bearer token.

Start Vite from the `web` directory:

```powershell
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Environment configuration

### API: `api/.env`

Start from [`api/.env.example`](api/.env.example) and set values for the local
environment. Common settings:

| Variable                                            | Purpose                                                                               |
| --------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `APP_KEY`                                           | Laravel application encryption key; generate with `php artisan key:generate`.         |
| `APP_URL`                                           | Base URL where the API is served.                                                     |
| `DB_CONNECTION`                                     | Database driver; the example uses SQLite.                                             |
| `DB_DATABASE`                                       | Database location when overriding the SQLite default.                                 |
| `SESSION_DRIVER`, `CACHE_STORE`, `QUEUE_CONNECTION` | Laravel session, cache, and queue backends. The example uses database-backed drivers. |
| `MAIL_MAILER`                                       | Mail delivery method. The example configuration logs mail locally.                    |
| `CLOUDINARY_URL`                                    | Private Cloudinary credentials in `cloudinary://<key>:<secret>@<cloud_name>` form.    |
| `CLOUDINARY_UPLOAD_FOLDER`                          | Optional Cloudinary destination folder for new post images.                           |

Never commit `.env` files or expose Cloudinary credentials in frontend
variables. The browser should communicate with the Laravel API; the Cloudinary
secret belongs only in the API environment.

### Frontend: `web/.env`

Vite exposes variables prefixed with `VITE_` to browser code. Do not put
passwords, API secrets, or Cloudinary credentials in this file.

## Database and seed data

Migrations create users, categories, tags, posts, comments, likes, and the
post-tag relationship. Post images are represented by Cloudinary's public ID
and delivery URL on each post.

To seed local example content:

```powershell
Set-Location api
php artisan db:seed
```

The database seeder is intended for development and **skips execution when
`APP_ENV=production`**. In non-production environments it clears the existing
users, categories, tags, comments, and posts before repopulating them. Do not
run it against a database whose data you need to preserve.

Seeded data includes:

- Ten fixed computing-related categories: Programming, Web Development,
  Software Engineering, Computer Science, Artificial Intelligence, Data
  Science, Cybersecurity, Cloud Computing, DevOps, and Hardware and Systems.
- Example users, posts, tags, comments, and likes.
- A local admin account with email `admin@dojo.com` and password `testPass`.

The seeded credentials are for local development only. Change or remove them
before using seeded data in any shared environment. The example posts and
related content use factories and may be randomized.

## Application routes

### Frontend pages

| Route                 | Access                                       | Purpose                                              |
| --------------------- | -------------------------------------------- | ---------------------------------------------------- |
| `/`                   | Public                                       | Published feed with category filtering.              |
| `/posts/:postId`      | Public                                       | Post details, likes, and comments.                   |
| `/auth`               | Guest                                        | Sign-in page.                                        |
| `/auth/register`      | Guest                                        | Registration page.                                   |
| `/profile`            | Signed in                                    | Account details and published/draft post management. |
| `/liked-post`         | Signed in                                    | Posts liked by the current user.                     |
| `/posts/create`       | Signed in                                    | Create a post or draft.                              |
| `/posts/:postId/edit` | Signed in; post must be editable by the user | Edit a post.                                         |

### API routes

The Laravel API is mounted under `/api`.

Public versioned API routes are under `/api/v1`, including:

- `GET /api/v1/posts` — published feed; accepts pagination and category-slug
  filtering.
- `GET /api/v1/posts/{post}` — post details.
- `GET /api/v1/categories` and `GET /api/v1/categories/{category}`.
- `GET /api/v1/tags` and `GET /api/v1/tags/{tag}`.
- `GET /api/v1/posts/{post}/comments`.

Authentication routes include `POST /api/register`, `POST /api/login`,
`POST /api/logout`, password reset endpoints, and email verification endpoints.
The login response provides a bearer token used by the frontend for
authenticated API calls.

Authenticated versioned routes include:

- `GET /api/user` — current user.
- `GET /api/v1/user/posts` — the current user's posts; accepts a `status`
  filter (`published` or `draft`).
- `POST /api/v1/posts`, `PATCH /api/v1/posts/{post}`, and
  `DELETE /api/v1/posts/{post}`.
- `POST /api/v1/posts/{post}/image` and
  `DELETE /api/v1/posts/{post}/image`.
- `PATCH /api/v1/user/posts/{post}/publish` and
  `PATCH /api/v1/user/posts/{post}/draft`.
- `POST /api/v1/posts/{post}/like` and `GET /api/v1/likes`.
- `POST /api/v1/posts/{post}/comments`, plus comment update/delete routes.
- Authenticated category and tag management routes.

The route definitions in [`api/routes/api.php`](api/routes/api.php) and
[`api/routes/auth.php`](api/routes/auth.php) are authoritative if this summary
and the implementation ever differ. Laravel route inspection:

```powershell
Set-Location api
php artisan route:list --path=api
```

## Image uploads

Post images are uploaded from the frontend to the authenticated Laravel API.
The API validates image type and size, signs the Cloudinary upload using the
server-side `CLOUDINARY_URL` credentials, and saves the returned `public_id`
and secure delivery URL to the post.

Configure `CLOUDINARY_URL` and, optionally, `CLOUDINARY_UPLOAD_FOLDER` in
`api/.env`. The folder is included in the signed Cloudinary upload request.
Changing it affects new uploads and does not move existing images.

The application accepts JPEG, PNG, and WebP images up to 5 MB. PHP's
`upload_max_filesize` must allow at least 5 MB, `post_max_size` must be larger
than the upload (the PHP example uses 8 MB), and the PHP upload temporary
directory must exist and be writable by the API process. Cloudinary settings
are API-only and should never be exposed through `web/.env`.

## Development commands

Run commands from the relevant app directory.

### Frontend (`web`)

```powershell
npm run dev       # Start Vite development server
npm run build     # Type-check and create a production build
npm run lint      # Run Oxlint
npm run preview   # Preview the production build
```

### API (`api`)

```powershell
php artisan serve                         # Start Laravel's development server
php artisan migrate                       # Apply database migrations
php artisan test                          # Run Pest tests
vendor/bin/pint --dirty --format agent    # Format changed PHP files
php artisan route:list --path=api         # Inspect API routes
```

## Troubleshooting

- **Frontend reports a missing environment variable:** check `web/.env`, ensure
  all four required `VITE_` variables are set, and restart the Vite server after
  editing them.
- **Frontend requests go to the wrong API URL:** confirm
  `VITE_ENVIRONMENT` is `development` locally and that the selected API URL
  ends in `/api`.
- **SQLite database cannot be opened:** verify `api/database/database.sqlite`
  exists and is writable, then run `php artisan migrate` from `api`.
- **Image upload fails before reaching Laravel validation:** check the PHP
  server's `upload_tmp_dir`, `upload_max_filesize`, and `post_max_size` settings
  and restart the API process after changing PHP configuration.
- **Cloudinary rejects an upload:** verify `CLOUDINARY_URL`, the configured
  folder, and that API configuration has been refreshed/reloaded after editing
  environment values. Review the Laravel log for the API error; do not log or
  share credential values.
- **A development database unexpectedly loses content:** the database seeder
  clears its application records before inserting new sample data. Avoid
  rerunning `php artisan db:seed` when preserving local data.

## Additional documentation

- [Laravel API documentation](api/README.md)
- [Frontend package notes](web/README.md)
