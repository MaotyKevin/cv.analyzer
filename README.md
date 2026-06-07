# CVMatch

An AI-powered CV analyzer that scores a candidate's CV against a job description, identifies gaps, and generates a fully rewritten, ATS-optimized version in seconds.

---

## Features

- Match score from 0 to 100 based on keyword alignment, experience, and profile fit
- Strengths, weaknesses, and missing keyword analysis
- Fully rewritten optimized CV tailored to the job description
- PDF export of the full analysis report
- JWT-based authentication (register / login)
- Usage limiting — 3 free analyses per account
- Stripe payment integration for unlimited access

---


## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com/app/apikey) API key
- A [Stripe](https://dashboard.stripe.com) account

---

## Stripe Configuration

### 1. Create a Stripe account

Sign up at [dashboard.stripe.com](https://dashboard.stripe.com). Make sure you are in **Test mode**.

---

### 2. Create a product and price

- Go to **Product catalog** → **Add product**
- Name: `CVMatch Pro`
- Price: `$5.00` — One time
- Save and copy the **Price ID** (starts with `price_...`)

---

### 3. Get your API keys

Go to **Developers** → **API keys** and copy:
- Publishable key → `pk_test_...`
- Secret key → `sk_test_...`

Add both to your `.env`.

---

### 4. Set up webhook forwarding (local development)

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and log in:

```bash
stripe login
```

Start webhook forwarding in a separate terminal:

```bash
stripe listen --forward-to localhost:8000/api/webhook/
```

Copy the webhook signing secret printed in the terminal (`whsec_...`) and add it to your `.env` as `STRIPE_WEBHOOK_SECRET`.

---

### 5. Test the payment flow

Run all three servers simultaneously:

```bash
# Terminal 1 — Django
python manage.py runserver

# Terminal 2 — React
cd cvmatch-frontend && npm run dev

# Terminal 3 — Stripe CLI
stripe listen --forward-to localhost:8000/api/webhook/
```

Use Stripe's test card to simulate a payment:

| Field | Value |
|---|---|
| Card number | `4242 4242 4242 4242` |
| Expiry | Any future date |
| CVC | Any 3 digits |
| ZIP | Any value |

After a successful payment, the user's account is upgraded to unlimited analyses.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/register/` | No | Create a new account |
| POST | `/api/login/` | No | Obtain JWT token pair |
| POST | `/api/token/refresh/` | No | Refresh access token |
| GET | `/api/me/` | Yes | Get current user profile |
| POST | `/api/analyze-cv/` | Yes | Analyze CV against job description |
| POST | `/api/create-checkout-session/` | Yes | Create Stripe checkout session |
| POST | `/api/webhook/` | No | Stripe webhook handler |

---

## Usage Limits

| Plan | Analyses |
|---|---|
| Free | 3 |
| Pro ($5 one-time) | Unlimited |




