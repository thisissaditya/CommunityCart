# CommunityCart — A Unified Rural Community Platform 🌾🛒

> **EPICS Project (Fall Semester 2026)**  
> *A comprehensive MERN-stack ecosystem engineered to bridge commerce, civic transparency, healthcare accessibility, and disaster response for rural and semi-urban communities.*

---

## 📖 1. Project Overview

Rural communities frequently encounter fragmented access to essential everyday goods and public services. Local shopkeepers (kirana owners, mess providers, chemists) lack digital distribution channels, while residents travel long distances for necessities. Concurrently, civic complaints regarding broken water pipelines, road potholes, or power transformers face delays due to manual paperwork and absent transparency.

**CommunityCart** creates a centralized digital ecosystem uniting:
1. 🍲 **Gramin Food & Mess Ordering**: Digital menus, meal customization, doorstep delivery.
2. 🥦 **Village Kirana & Produce**: Stone-ground flour, farm dairy, fresh vegetables, daily provisions.
3. 💊 **Jan Aushadhi & Pharmacy**: Generic subsidized medicines, first-aid kits, essential OTC care.
4. 📢 **Civic Grievance Desk**: Publicly trackable complaints for roads, water, power, and sanitation.
5. 🩺 **Community Health & Drives**: Free eye checkup camps, blood donation drives, farmer extension workshops.
6. 🚨 **24/7 Emergency SOS Hotline**: One-touch dispatch and directory for Ambulance (108), Police (112), and Gram Panchayat security.
7. 📊 **Executive Management Portal**: Dual-purpose dashboard for local shopkeepers (inventory, stock status) and Panchayat administrators (civic resolution metrics).

---

## 🎨 Design Philosophy & Visual Inspirations

The platform merges two modern, battle-tested design paradigms:
- **Consumer Simplicity & Marketplace Dynamism (inspired by Swiggy)**:
  - Accessible location picker for villages and panchayats.
  - Vibrant saffron and verdant agricultural accents (`#EA580C`, `#059669`).
  - Intuitive product cards with quantity increment/decrement buttons and instant Cash-on-Delivery checkout.
- **Data-Rich Executive Oversight (inspired by Dribbble Modern Dashboards)**:
  - Bento metric cards with live trend counters.
  - Interactive stock management table with instant out-of-stock toggles.
  - Public grievance status pipeline (`Pending` ➔ `In Progress` ➔ `Resolved`).

---

## 🏗️ System Architecture

```
                                  ┌─────────────────────────────┐
                                  │       Client Browser        │
                                  │   (React.js + Vite + CSS)   │
                                  └──────────────┬──────────────┘
                                                 │
                                                 │ HTTP / REST / JSON
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │     Node.js + Express       │
                                  │         REST API            │
                                  └──────────────┬──────────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        ▼                                                 ▼
             ┌─────────────────────┐                           ┌─────────────────────┐
             │   MongoDB Atlas /   │                           │ Resilient In-Memory │
             │    Local Mongoose   │                           │     Seed Engine     │
             └─────────────────────┘                           └─────────────────────┘
```

---

## 🚀 Implemented Capabilities & Deliverables (Till Now Completion — 60%)

### 🏗️ Foundation & Core Architecture (Phase 1)
- [x] **Project Repository & Monorepo Structure**: Complete workspace with clean modular `client/` and `server/` trees.
- [x] **Custom CSS Design Tokens**: Saffron orange, verdant emerald, dark slate, modern typography tokens, and responsive layout primitives.
- [x] **Universal Navigation**: Sticky navbar with multi-village selector, 24/7 emergency SOS banner, and live role switching pill.
- [x] **Marketplace Discovery Hub**: Multi-category service tiles, verified vendor cards, and rich local product catalogues.
- [x] **Interactive Cart & Cash-on-Delivery Drawer**: Full bill breakdown, village delivery landmark input, COD / UPI selection, and instant order placement.
- [x] **Civic Grievance Desk**: Interactive submission modal with priority tags, status badges, and assigned panchayat officer tracking.
- [x] **Community Outreach Hub**: Scheduled health camps, blood donation drives, farmer extension workshops, and attendee registration.
- [x] **Management Dashboard**: Dribbble-style bento metric cards, inventory stock toggles, and grievance resolution workflows.
- [x] **Multi-Role Authentication**: Seamless switching between Citizen, Shop Owner, and Panchayat Admin modes.
- [x] **Resilient Express Backend**: Modular controllers, Mongoose schemas (`User`, `Store`, `Product`, `Order`, `Complaint`, `EmergencyContact`), and automatic zero-downtime in-memory fallback engine.

### ☁️ Cloud, Media & Persistence (Phase 2)
- [x] **MongoDB Atlas Cloud Synchronization**: Production cloud database cluster integration with automatic Mongoose ID mapping and automated cross-environment seeding (`npm run seed`).
- [x] **Cloudinary Prescription Upload**: Secure file upload backend endpoints with `multer` & `multer-storage-cloudinary`, featuring an animated drag-and-drop UI with strict checkout prescription validation for pharmacy orders.
- [x] **Live Cart Synchronization**: `LocalStorage` persistence layer in `AppContext.jsx` ensuring cart contents persist seamlessly across browser sessions and refreshes.

### 🚚 Operations, Logistics & Dhaba Integration (Phase 3 — Current Milestone)
- [x] **Authentic Indian Dhaba & Local Restaurant Dataset**: Complete, authentic regional menu records for *Sharma Ji Ka Mess & Dhaba* (pure desi ghee thalis & dal makhani), *Apna Dhaba & Tandoor Corner* (highway-style paneer butter masala & tandoori naans), *Chaudhary Sweets* (khasta samosas, hot desi ghee jalebis, chole bhature, kulhad chai), *Royal Rajputana Dhaba* (dal baati churma, missi roti), plus authentic Kirana staples and generic pharmacy supplies with realistic INR pricing and high-resolution food photography.
- [x] **Full-Lifecycle Order Management & Tracking**: End-to-end Mongoose `Order` model, unique order numbers (`ORD-XXXXX`), payment modes, and the **"My Orders & Deliveries"** interface featuring an animated 5-step progress stepper:
  $$\text{Order Placed} \longrightarrow \text{Accepted} \longrightarrow \text{Cooking / Packing} \longrightarrow \text{Out for Delivery} \longrightarrow \text{Delivered}$$
- [x] **Interactive Order Progression Simulator**: Built-in helper on citizen order cards allowing evaluators to simulate real-time status transitions and watch the progress stepper and SMS gateway react live.
- [x] **Vendor Active Orders Pipeline**: Dedicated operational pipeline in the Management Dashboard allowing shop owners to accept incoming orders, transition to food preparation, and assign riders for doorstep dispatch.
- [x] **Vendor Inventory Bulk & Dhaba Quick-Import Utility**: One-click menu importer featuring 4 regional Indian culinary presets (*Dhaba Curries & Paneer*, *Tandoor Breads*, *Halwai Sweets & Chaat*, *Village Kirana*) alongside a CSV spreadsheet parser for rapid catalog updates.
- [x] **Simulated Rural SMS Gateway**: Real-time SMS notification component (`SmsNotificationToast.jsx`) that emulates cellular alerts sent via BSNL/Jio rural networks upon order placement, rider dispatch, delivery completion, and civic grievance resolution.

---

## 💻 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Custom Design System Tokens, Tailwind CSS v3, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js, Multer, Cloudinary SDK |
| **Database** | MongoDB Atlas / Mongoose (with dual-mode zero-downtime fallback seed engine) |
| **Cloud Media** | Cloudinary (Medical Prescription storage & verification) |
| **Authentication** | JWT (JSON Web Tokens) & Role-Based Access Control |
| **Version Control** | Git & GitHub |

---

## 🛠️ How to Run Locally

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/thisissaditya/CommunityCart.git
cd CommunityCart

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Run the Development Server
```bash
# Run both Frontend and Backend concurrently
npm run dev

# Or run them independently:
# Terminal 1: Backend (Port 5000)
npm run server

# Terminal 2: Frontend (Port 3000)
npm run client
```

Open your browser at `http://localhost:3000` to interact with the platform!

---

## 👥 Multi-Role Demo Access

The platform includes built-in instant demo accounts for academic review:
- **🌿 Citizen / Buyer**: Aditya Rakesh (`aditya@example.com`)
- **🏪 Shop Owner / Vendor**: Ramesh Sharma (`ramesh@sharmadhaba.com` - Sharma Ji Ka Mess & Dhaba)
- **🏛️ Panchayat Administrator**: Mukhiya Ji (`admin@rampurpanchayat.gov.in` - Rampur Gram Panchayat)

---

## 📈 Roadmap

- [x] **Phase 1 (10%)**: Architectural skeleton, core design system, marketplace hub, civic complaints, emergency SOS, mock store, and initial repo push.
- [x] **Phase 2 (30%)**: MongoDB Atlas cloud synchronization, Cloudinary prescription upload (aesthetic UI integration), live cart synchronization (LocalStorage persistence).
- [x] **Phase 3 (60%)**: Detailed order history & tracking, authentic Indian Dhaba & local restaurant dataset, vendor active orders pipeline, vendor inventory bulk upload & dhaba presets, SMS notifications via simulated rural gateway.
- [ ] **Phase 4 (80%)**: Full Panchayat analytics, grievance photo uploads, bilingual Hindi / Regional language support.
- [ ] **Phase 5 (100%)**: Performance optimization for low-bandwidth 2G/3G networks, offline-first PWA sync, final defense presentation.
