# Mutual Fund Returns & SIP Calculator

A full-stack **Next.js + Material UI** project that allows users to:
- Browse mutual funds
- View scheme metadata and NAV history
- Calculate returns (1m, 3m, 6m, 1y or custom range)
- Run SIP (Systematic Investment Plan) calculations
- Visualize NAV and investment growth with charts

---

## 🚀 Features

### Backend (Next.js API Routes)
- **List all schemes**
  - `GET /api/mf` – Fetches and caches all schemes.
- **Scheme details**
  - `GET /api/scheme/:code` – Metadata (fund house, type, ISINs) + NAV history.
- **Returns calculator**
  - `GET /api/scheme/:code/returns?period=1m|3m|6m|1y`  
  - or `GET /api/scheme/:code/returns?from=YYYY-MM-DD&to=YYYY-MM-DD`
  - Response: startDate, endDate, startNAV, endNAV, simpleReturn %, annualizedReturn %.
- **SIP calculator**
  - `POST /api/scheme/:code/sip`
  - Request body:
    ```json
    {
      "amount": 5000,
      "frequency": "monthly",
      "from": "2020-01-01",
      "to": "2023-12-31"
    }
    ```
  - Response:
    ```json
    {
      "totalInvested": 240000,
      "currentValue": 320000,
      "totalUnits": 12345.67,
      "absoluteReturn": 33.3,
      "annualizedReturn": 12.1
    }
    ```

---

### Frontend (Next.js + MUI)
- **Fund Search / Listing Page (`/funds`)**
  - Group by fund house & category
  - Search bar to filter schemes
  - Responsive grid layout with MUI Cards

- **Scheme Detail Page (`/scheme/[code]`)**
  - Display scheme metadata
  - **NAV Chart** (last 1 year, line chart)
  - **Precomputed Returns Table** (1m, 3m, 6m, 1y)
  - **SIP Calculator Form**
    - Enter amount, frequency, start date, end date
    - Displays results: total invested, current value, absolute return %, annualized return %
    - Growth chart visualization

---

## 🛠 Tech Stack
- **Frontend:** Next.js (App Router), React, Material UI, Recharts
- **Backend:** Next.js API routes
- **Data Handling:** Fetch API + in-memory caching
- **Optional:** Redis for extended caching

---

## 📦 Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/mutual-fund-sip-calculator.git
cd mutual-fund-sip-calculator

npm install

npm run dev
```

### Project Structure
```
src/
  api/                # Backend API routes
    mf.js             # List all schemes
    scheme/[code]/    # Scheme details, returns, SIP
  app/                # Frontend pages
    funds/            # Fund listing page
    scheme/[code]/    # Scheme detail page
components/           # Reusable UI components
```

