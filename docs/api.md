# API Reference

All endpoints are prefixed with `/api/`. The backend runs at `http://127.0.0.1:8000` in development.

---

## Authentication

CVMatch uses JWT (JSON Web Tokens) for authentication.

After login, include the access token in every protected request:

```
Authorization: Bearer <access_token>
```

Tokens expire after 1 day. Use the refresh endpoint to obtain a new access token without re-logging in.

---

## Endpoints

### Register

```
POST /api/register/
```

Creates a new user account. No authentication required.

**Request body:**

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response — 201 Created:**

```json
{
  "message": "Account created successfully."
}
```

**Response — 400 Bad Request:**

```json
{
  "error": "Username already taken."
}
```

---

### Login

```
POST /api/login/
```

Returns a JWT access and refresh token pair. No authentication required.

**Request body:**

```json
{
  "username": "john",
  "password": "securepassword"
}
```

**Response — 200 OK:**

```json
{
  "access": "eyJ...",
  "refresh": "eyJ..."
}
```

---

### Refresh Token

```
POST /api/token/refresh/
```

Returns a new access token using a valid refresh token.

**Request body:**

```json
{
  "refresh": "eyJ..."
}
```

**Response — 200 OK:**

```json
{
  "access": "eyJ..."
}
```

---

### Get Current User

```
GET /api/me/
```

Returns the authenticated user's profile and usage stats.

**Headers:** `Authorization: Bearer <token>`

**Response — 200 OK:**

```json
{
  "username": "john",
  "email": "john@example.com",
  "analyses_used": 2,
  "free_limit": 3,
  "is_paid": false,
  "has_reached_limit": false
}
```

---

### Analyze CV

```
POST /api/analyze-cv/
```

Sends a CV and job description to the AI engine and returns a full analysis.

**Headers:** `Authorization: Bearer <token>`

**Request body:**

```json
{
  "cv": "Full CV text here...",
  "job_description": "Full job description here..."
}
```

**Response — 200 OK:**

```json
{
  "score": 72,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "missing_keywords": ["..."],
  "improvements": ["..."],
  "optimized_cv": "Full rewritten CV...",
  "analyses_used": 3,
  "free_limit": 3,
  "is_paid": false
}
```

**Response — 403 Forbidden (limit reached):**

```json
{
  "error": "limit_reached",
  "message": "You have used all your free analyses.",
  "analyses_used": 3,
  "free_limit": 3
}
```

---

### Create Checkout Session

```
POST /api/create-checkout-session/
```

Creates a Stripe Checkout Session and returns the hosted payment URL.

**Headers:** `Authorization: Bearer <token>`

**Response — 200 OK:**

```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

Redirect the user to this URL to complete payment.

---

### Stripe Webhook

```
POST /api/webhook/
```

Receives and processes Stripe webhook events. Called by Stripe automatically — do not call this manually.

Handles the `checkout.session.completed` event to upgrade the user's account to unlimited access.

**Response — 200 OK:**

```json
{
  "status": "ok"
}
```

---

## Error responses

| Status | Meaning |
|---|---|
| 400 | Bad request — missing or invalid fields |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — free limit reached |
| 500 | Server error — AI or internal failure |
