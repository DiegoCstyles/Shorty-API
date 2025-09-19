# Shorty API 🚀

A simple URL shortening API built with **Node.js**, **Express**, and **PostgreSQL**.  

- Create short URLs with a unique code.  
- Track click analytics.  
- Secure endpoints with API keys.  
- Deployable on **Railway** or any Node.js hosting.

---

## Features

- Shorten long URLs (`POST /shorten`)  
- Redirect to original URL (`GET /:code`)  
- Analytics for each short URL (`GET /analytics/:code`)  
- PostgreSQL persistence  
- API key protection  
- Easy deployment with Railway

---

## Tech Stack

- Node.js + Express  
- PostgreSQL (hosted via Railway or local)  
- nanoid (for short codes)  
- dotenv, helmet, morgan, cors

---

## Getting Started

### 1. Clone repository

```bash
git clone https://github.com/YourUsername/Shorty-API.git
cd Shorty-API
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a .env file in the project root:
```dotenv
# Server
PORT=3000
BASE_URL=https://shorty.up.railway.app   # or your custom domain

# Security
API_KEY=your-secret-api-key

# Database (PostgreSQL)
DATABASE_URL=postgres://username:password@hostname:5432/dbname
```
Important: Do not commit .env to GitHub. Add it to .gitignore.

### 4. Run locally (development)
```bash
npm run dev
```

