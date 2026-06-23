# AlphaiStore — Full-Stack E-Commerce

Ghana's #1 Phone Store. Built with Next.js 14 (Pages Router) + Express.js + MongoDB + Cloudinary.

---

## 📁 Project Structure

```
alpha-istore/
├── backend/                  # Express.js API
│   ├── config/
│   │   └── cloudinary.js     # Cloudinary config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── settingsController.js
│   ├── middleware/
│   │   └── auth.js           # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Settings.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── orders.js
│   │   ├── products.js
│   │   ├── settings.js
│   │   └── upload.js
│   ├── utils/
│   │   └── seed.js           # Database seeder
│   ├── server.js
│   └── .env.example
│
└── frontend/                 # Next.js 14 Pages Router
    ├── components/
    │   ├── admin/
    │   │   └── AdminLayout.js
    │   ├── cart/
    │   │   └── CartDrawer.js
    │   ├── layout/
    │   │   ├── Layout.js
    │   │   ├── Navbar.js
    │   │   ├── Footer.js
    │   │   └── MobileNav.js
    │   ├── product/
    │   │   └── ProductCard.js
    │   └── ui/
    │       └── WhatsAppFloat.js
    ├── lib/
    │   └── api.js            # Axios API client
    ├── pages/
    │   ├── admin/
    │   │   ├── index.js      # Dashboard
    │   │   ├── products.js   # Product management
    │   │   ├── orders.js     # Order management
    │   │   └── settings.js   # Store settings
    │   ├── auth/
    │   │   ├── login.js
    │   │   └── signup.js
    │   ├── product/
    │   │   └── [id].js       # Product detail
    │   ├── _app.js
    │   ├── index.js          # Homepage
    │   ├── shop.js           # Shop with filters
    │   ├── checkout.js
    │   ├── order-confirm.js
    │   ├── orders.js         # My orders
    │   ├── track.js          # Order tracking
    │   ├── about.js
    │   └── contact.js
    ├── store/
    │   └── index.js          # Zustand cart + auth
    ├── styles/
    │   └── globals.css
    └── .env.local.example
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

---

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in .env with your credentials
npm run dev
```

**.env values to fill:**
| Key | Where to get it |
|-----|----------------|
| `MONGO_URI` | MongoDB Atlas → Connect → Drivers |
| `JWT_SECRET` | Any random 32+ char string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary Dashboard → API Keys |
| `CLOUDINARY_API_SECRET` | Cloudinary Dashboard → API Keys |
| `CLIENT_URL` | `http://localhost:3000` for dev |

**Seed the database:**
```bash
# Add these to backend/.env first:
# ADMIN_EMAIL=your-admin@email.com
# ADMIN_PASSWORD=your-secure-password

npm run seed
# Creates admin user
# Creates 6 sample products
```

---

### Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Fill in your values
npm run dev
```

**.env.local values:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_WHATSAPP_NUMBER=233000000000
```

---

## 🔑 Admin Access

After seeding, use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set in your `backend/.env` file:
- URL: `http://localhost:3000/auth/login`
- Email: *the value you set for `ADMIN_EMAIL`*
- Password: *the value you set for `ADMIN_PASSWORD`*

---

## 🌐 Deployment

### Backend → Render

1. Push backend to GitHub
2. New Web Service on [render.com](https://render.com)
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all `.env` variables in Render dashboard
6. Note your Render URL (e.g. `https://alpha-istore-api.onrender.com`)

### Frontend → Vercel

1. Push frontend to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://alpha-istore-api.onrender.com/api
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_WHATSAPP_NUMBER=233000000000
   ```
4. Deploy — Vercel auto-detects Next.js

---

## 📱 iOS Safari Compatibility

All iOS Safari rules are followed:
- ✅ No `'use client'` directives (Pages Router)
- ✅ All `window`/`localStorage` access inside `useEffect` via `safeStorage` util
- ✅ Passive scroll listeners everywhere
- ✅ Plain `<img>` tags for all product images (no `next/image`)
- ✅ All Cloudinary images use `/upload/w_400,q_60,f_webp/` transformation
- ✅ `ErrorBoundary` wrapping entire app
- ✅ Correct viewport meta tag in `_app.js`
- ✅ No backdrop-filter or complex CSS filters
- ✅ No continuous CSS animations during scroll

---

## 🛍️ Features

### Customer
- Homepage with hero, trust bar, promo banners, hot deals, featured, testimonials
- Shop with sidebar filters (brand, condition, storage, price range)
- Search + sort + pagination
- Product detail with image gallery, variants, flash sale countdown
- Cart drawer (slide-in, persistent)
- Checkout with Ghana delivery regions + MoMo/Telecel/Card/POD payments
- Order confirmation with order number
- Order tracking timeline
- My orders page
- Login / Signup
- WhatsApp float button

### Admin
- Dashboard with stats, charts, recent orders, top products
- Product management (add/edit/delete, image upload to Cloudinary, variants)
- Order management with status updates, expandable detail rows
- Settings: hero content, payment toggles, delivery locations, social links

---

## 🔌 API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
PUT    /api/auth/me
PUT    /api/auth/password
PUT    /api/auth/wishlist/:productId

GET    /api/products            ?page,limit,brand,condition,storage,minPrice,maxPrice,search,sort,featured,hotDeal
GET    /api/products/stats      (admin)
GET    /api/products/slug/:slug
GET    /api/products/:id
POST   /api/products            (admin)
PUT    /api/products/:id        (admin)
DELETE /api/products/:id        (admin)
POST   /api/products/:id/reviews

POST   /api/orders
GET    /api/orders/my
GET    /api/orders/track/:orderNumber
GET    /api/orders              (admin)
GET    /api/orders/dashboard-stats (admin)
PATCH  /api/orders/:id/status   (admin)

GET    /api/settings
PUT    /api/settings            (admin)

POST   /api/upload/images       (admin)
DELETE /api/upload/image        (admin)
```

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 Pages Router |
| Styling | Tailwind CSS + inline styles |
| State | Zustand |
| Backend | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (httpOnly cookies) |
| Images | Cloudinary |
| Notifications | react-hot-toast |
| Deploy Frontend | Vercel |
| Deploy Backend | Render |

---

## 📞 Support

WhatsApp: Set your number in Admin → Settings → Contact
