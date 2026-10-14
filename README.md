# Inventory App (fullstack)

Express + MongoDB (Mongoose) backend and React (Vite + Tailwind) frontend.

## Run locally

Requirements: Node.js 24 (`nvm use 24`) and a MongoDB instance. You must supply your own `MONGODB_URI` (MongoDB Atlas free cluster, or a local `mongod`).

Backend (http://localhost:3000):

```bash
cd backend
cp .env.example .env     # then edit .env: set MONGODB_URI and a strong JWT_SECRET
npm ci
npm start                # nodemon app.js
```

`backend/.env.example` (placeholders only):

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/inventory
JWT_SECRET=change-me-to-a-long-random-string
JWT_EXPIRES_IN=1d
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-app-password
```

Frontend (http://localhost:5173; expects the API at http://localhost:3000/api):

```bash
cd frontend
npm ci
npm run dev       # also: npm run lint, npm run build
```

Notes:
- `POST /api/auth/register` always creates a `user`. To get an admin, register normally and then set `role: "admin"` on that user in the database (admin is required for create/update/delete of products and categories, `/api/users`, `/api/dashboard`).
- API groups: `/api/auth`, `/api/products`, `/api/categories`, `/api/users`, `/api/dashboard`, `/api/mailer`.
