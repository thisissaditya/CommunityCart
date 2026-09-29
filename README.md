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

## 🚀 10% Foundation Milestone Deliverables

- [x] **Project Repository & Monorepo Structure**: Complete workspace with `client/` and `server/`.
- [x] **Custom CSS Design Tokens**: Saffron orange, verdant emerald, dark slate, and typography tokens.
- [x] **Universal Navigation**: Sticky navbar with village selector, 24/7 SOS alert banner, and role pill.
- [x] **Marketplace Discovery Hub**: Multi-category service tiles, verified vendor cards, and catalogue items.
- [x] **Interactive Cart & Cash-on-Delivery Drawer**: Full bill breakdown, village delivery landmark input, and instant order placement.
- [x] **Civic Grievance Desk**: Interactive submission modal with priority tags, status badges, and assigned officer tracking.
- [x] **Community Outreach Hub**: Scheduled health camps, blood donation drives, and attendee registration.
- [x] **Management Dashboard Prototype**: Dribbble-style bento cards, inventory stock toggle, and grievance resolution actions.
- [x] **Multi-Role Authentication**: Seamless switching between Citizen, Shop Owner, and Panchayat Admin.
- [x] **Resilient Express Backend**: Modular controllers, Mongoose schemas (`User`, `Store`, `Product`, `Complaint`, `EmergencyContact`), and automatic in-memory fallback.

---

## 💻 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Custom Modern CSS (No Tailwind dependency), Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB / Mongoose (with automated fallback seed engine) |
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
- [ ] **Phase 3 (60%)**: Detailed order history, SMS notifications via rural gateway, vendor inventory bulk upload.
- [ ] **Phase 4 (80%)**: Full Panchayat analytics, grievance photo uploads, attendance certificates for donation camps.
- [ ] **Phase 5 (100%)**: Performance optimization for low-bandwidth 2G/3G networks, multi-language localization (Hindi/Regional), final defense presentation.
