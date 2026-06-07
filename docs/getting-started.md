# Getting Started

This guide covers everything you need to run CVMatch locally from scratch.

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com/app/apikey) API key
- A [Stripe](https://dashboard.stripe.com) account (for payment testing)

---

## 1. Clone the repository

```bash
git clone https://github.com/MaotyKevin/cv.analyzer.git
cd cv.analyzer
```

---

## 2. Backend setup

```bash
# Create virtual environment
python -m venv venv

# Activate — Windows
venv\Scripts\activate

# Activate — Mac / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

## 3. Backend environment variables

Create a `.env` file at the root of the project:

```env
# Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL used for Stripe redirects
FRONTEND_URL=http://localhost:5173
```

> Never commit your `.env` file. Confirm it is listed in `.gitignore`.

---

## 4. Run database migrations

```bash
python manage.py migrate
```

---

## 5. Start the Django server

```bash
python manage.py runserver
```

Backend is now running at `http://127.0.0.1:8000`

---

## 6. Frontend setup

```bash
cd cvmatch-frontend
npm install
```

Create a `.env` file inside `cvmatch-frontend/`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_AUTH_TOKEN_STORAGE_KEY=token
```

Start the frontend:

```bash
npm run dev
```

Frontend is now running at `http://localhost:5173`

---

## 7. Running all services together

For full local development including Stripe webhook testing, you need three terminals running simultaneously:

```bash
# Terminal 1 — Django backend
python manage.py runserver

# Terminal 2 — React frontend
cd cvmatch-frontend && npm run dev

# Terminal 3 — Stripe webhook forwarding
stripe listen --forward-to localhost:8000/api/webhook/
```
