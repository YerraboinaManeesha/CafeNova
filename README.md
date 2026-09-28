# CaféNova — Full Project

## Structure
- `client/landing.html` — customer-facing site (menu, cart, sign in/up, checkout)
- `client/admin.html` — admin dashboard (order management, menu management)
- `server/` — Express + MongoDB backend API

## Quick Start

1. **Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
   npm run seed            # creates menu items + admin account
   npm run dev              # starts API on http://localhost:5000
   ```

2. **Frontend**
   Just open `client/landing.html` and `client/admin.html` directly in your browser.
   Both are already pointed at `http://localhost:5000/api` — update the `API_BASE`
   constant near the top of each `<script>` block if you deploy the backend elsewhere.

## Flow
- Customers sign up / sign in on the landing page, add items to cart, checkout with a table number.
- Orders are saved to MongoDB linked to that customer.
- Admin logs into `admin.html` with the seeded admin account to view orders, update status, and manage the menu.

See `server/README.md` for full API endpoint documentation.
