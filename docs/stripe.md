# Stripe Configuration

CVMatch uses Stripe for one-time payment processing. This guide covers setup for both local development and production.

---

## 1. Create a Stripe account

Sign up at [dashboard.stripe.com](https://dashboard.stripe.com).

Make sure you are in **Test mode** (toggle in the top left of the dashboard) before doing anything else.

---

## 2. Create a product and price

1. Go to **Product catalog** → **Add product**
2. Set the name to `CVMatch Pro`
3. Set the price to `$5.00` — One time
4. Click **Save product**
5. Copy the **Price ID** from the pricing section — it looks like `price_1ABC...`

Add it to your `.env`:

```env
STRIPE_PRICE_ID=price_...
```

---

## 3. Get your API keys

Go to **Developers** → **API keys** and copy both keys:

```env
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

> The secret key is used only on the backend. Never expose it in the frontend.

---

## 4. Install the Stripe CLI

Download from [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli).

On Windows, download the `.exe` and add it to your PATH. Verify the installation:

```bash
stripe --version
```

Log in to your Stripe account:

```bash
stripe login
```

---

## 5. Start webhook forwarding

Run this in a dedicated terminal while developing locally:

```bash
stripe listen --forward-to localhost:8000/api/webhook/
```

The CLI prints a webhook signing secret:

```
> Ready! Your webhook signing secret is whsec_abc123...
```

Copy it and add it to your `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

Restart Django after updating `.env`.

---

## 6. Test the payment flow

Use Stripe's test cards — no real money is charged:

| Scenario | Card number |
|---|---|
| Successful payment | `4242 4242 4242 4242` |
| Payment declined | `4000 0000 0000 0002` |
| Requires authentication | `4000 0025 0000 3155` |

Use any future expiry date, any 3-digit CVC, and any ZIP code.

---

## 7. Trigger webhook events manually

You can simulate Stripe events without going through the full checkout:

```bash
stripe trigger checkout.session.completed
```

Useful for testing the webhook handler in isolation.

---

## 8. Payment flow overview

```
User clicks Upgrade
       ↓
Django creates a Stripe Checkout Session
       ↓
User is redirected to Stripe hosted payment page
       ↓
User pays with test card
       ↓
Stripe sends checkout.session.completed to /api/webhook/
       ↓
Django sets is_paid = True on the UserProfile
       ↓
User is redirected to /success
       ↓
Usage limit is lifted — unlimited analyses
```

---

## 9. Production webhook

When deploying, register your live webhook URL in the Stripe dashboard:

1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. Set the URL to `https://yourdomain.com/api/webhook/`
3. Select the event `checkout.session.completed`
4. Copy the signing secret and set it as `STRIPE_WEBHOOK_SECRET` in your production environment

> Do not use the CLI webhook secret in production. The dashboard generates a separate secret for each registered endpoint.
