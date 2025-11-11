# Keshless Tickets Dashboard - Quick Start

## 🚀 Get Started in 3 Steps

### 1. Start the Backend API
```bash
cd /home/laslie/Documents/omevision/third-party-contracts/keshless-tickets/dev/backend/keshless-tickets-api
npm start
```
Backend runs on: http://localhost:5000

### 2. Start the Dashboard
```bash
cd /home/laslie/Documents/omevision/third-party-contracts/keshless-tickets/dev/dashboard/keshless-tickets-dashboard
npm run dev
```
Dashboard runs on: http://localhost:3001

### 3. Login
- Open: http://localhost:3001
- Email: `test@vendor.com`
- Password: `password123`

## 📋 What You Can Do

### Create an Event
1. Go to "Events" page
2. Click "Create Event"
3. Fill in:
   - Event name, venue, dates
   - Ticket type (name, price, capacity)
4. Click "Create Event"
5. Click "Publish" to make it available

### Sell Tickets
1. Go to "Sell Tickets" page
2. Select your event
3. Select ticket type
4. Enter customer name and phone
5. Choose payment method:
   - **Cash**: Just click "Sell Tickets"
   - **Wallet**: Enter card number + PIN
6. Click "Sell Tickets"

### Scan Tickets
1. Go to "Entry Scan" page
2. Enter ticket ID (or scan QR code)
3. Click "Validate Ticket"
4. If valid, click "Check In"

### View Analytics
1. Go to "Analytics" page
2. See revenue by event (bar chart)
3. See payment breakdown (pie chart)

### Export Sales
1. Go to "Sales History" page
2. Click "Export CSV"
3. Download opens automatically

## 🎨 Features

- ✅ Real-time dashboard stats
- ✅ Event management (CRUD)
- ✅ Ticket sales (Cash + Wallet)
- ✅ Entry scanning & validation
- ✅ Analytics charts
- ✅ CSV export
- ✅ Mobile responsive

## 🔧 Tech Stack

- React 19.1.1 + TypeScript
- Vite 7.1.7
- TailwindCSS + shadcn/ui
- React Router + TanStack Query
- Recharts for charts

## 📱 Test Payment Methods

### Cash Payment
Just select "Cash" tab and sell - no extra info needed

### Keshless Wallet Payment
Use test wallet credentials (check backend docs)

## 🎯 API Endpoints

All at: `http://localhost:5000/api/tickets`

- Auth: `/auth/login`, `/auth/logout`, `/auth/me`
- Events: `/events` (GET/POST/PUT/DELETE)
- Sales: `/sales/sell` (POST), `/sales` (GET)
- Scans: `/scans/validate`, `/scans/check-in`
- Stats: `/stats/dashboard`, `/stats/sales`, `/stats/revenue`

## 🐛 Troubleshooting

**Dashboard won't start?**
```bash
npm install
npm run dev
```

**Can't login?**
- Check backend is running on port 5000
- Check test credentials are correct
- Check browser console for errors

**API errors?**
- Verify backend is running
- Check `.env.local` has correct API URL
- Check browser Network tab for failed requests

**Build errors?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📂 Project Location

```
/home/laslie/Documents/omevision/third-party-contracts/keshless-tickets/dev/dashboard/keshless-tickets-dashboard/
```

## 🎉 That's It!

You now have a fully functional event ticketing dashboard.

For more details, see `README.md` and `PROJECT_SUMMARY.md`
