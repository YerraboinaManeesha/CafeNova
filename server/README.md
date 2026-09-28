# Brew & Bliss — Backend API

Express + MongoDB backend for the Brew & Bliss coffee ordering app.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
   - `MONGO_URI` — your MongoDB connection string (local or MongoDB Atlas)
   - `JWT_SECRET` — any long random string (used to sign admin login tokens)
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials for the one admin account, used by the seed script

3. Seed the database (creates the 10 starter menu items + your admin account):
   ```bash
   npm run seed
   ```

4. Start the server:
   ```bash
   npm run dev     # with auto-restart (nodemon)
   npm start       # plain node
   ```

   Server runs on `http://localhost:5000` by default.

## API Endpoints

### Public
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/menu` | List all available menu items |
| POST | `/api/orders` | Place a guest order — body: `{ items, customerName, customerContact }` |
| GET | `/api/orders/:orderCode` | Check status of an order by its code (e.g. `BB4821`) |
| POST | `/api/admin/login` | Admin login — body: `{ email, password }` — returns a JWT |

### Protected (require `Authorization: Bearer <token>` header)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/me` | Verify current admin token |
| GET | `/api/admin/menu` | List all menu items (including unavailable ones) |
| POST | `/api/admin/menu` | Add a new menu item |
| PUT | `/api/admin/menu/:id` | Update a menu item |
| DELETE | `/api/admin/menu/:id` | Remove a menu item |
| GET | `/api/admin/orders` | List all orders (optionally `?status=pending`) |
| PUT | `/api/admin/orders/:id/status` | Update an order's status |

## Order flow

1. Customer places an order via `POST /api/orders` — no login required.
2. Order is saved with `status: "pending"` and a generated `orderCode` like `BB4821`.
3. Admin logs in via `POST /api/admin/login`, gets a JWT.
4. Admin views orders via `GET /api/admin/orders` and updates status via `PUT /api/admin/orders/:id/status` (pending → preparing → ready → completed).
5. Customer can check their order anytime via `GET /api/orders/:orderCode` — no account needed.
