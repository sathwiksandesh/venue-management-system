# 🎯 SmartVenue — Intelligent Crowd & Event Management System

🔗 **Live Demo:** https://venue-management-system-steel.vercel.app/

---

## 📌 Overview

**SmartVenue** is a real-time crowd and event management dashboard designed for large-scale venues like stadiums, concerts, and public events.

It provides live insights into:

* Crowd density
* Gate operations
* Food & concession queues
* Alerts & incidents
* Analytics & performance metrics

The system simulates real-time data and presents it through an interactive, modern UI.

---

## 🚀 Features

### 🧭 1. Overview Dashboard

* Displays key metrics:

  * Attendance
  * Capacity usage
  * Average wait time
  * Critical zones
  * Alerts count
* Combines multiple modules into one quick view

---

### 🗺️ 2. Crowd Map (Heatmap)

* Visual representation of venue zones
* Shows:

  * Zone occupancy levels
  * Status (Low / Moderate / Busy / Critical)
* Interactive:

  * Hover to view zone IDs (P1, W1, E1, etc.)
  * Click to select zones

---

### 🚪 3. Gate Management

* Real-time gate monitoring:

  * Queue length
  * Wait time
  * Active lanes
  * Throughput
* Smart actions:

  * Open extra lane
  * Redirect crowd
  * Alert staff

---

### 🍔 4. Concession Tracker

* Tracks food & beverage stalls
* Displays:

  * Wait times
  * Queue size
  * Sales rate
* AI-like suggestions:

  * Open counter
  * Enable pre-order
  * Redirect crowd

---

### 📊 5. Flow Analytics

* Data visualization using charts:

  * 📈 Inflow vs Outflow
  * ⏱️ Wait time trends
  * 🚨 Incident tracking
* Built with **Recharts**

---

### 🚨 6. Alert System

* Live alerts panel:

  * Crowd surge
  * Medical emergencies
  * Queue buildup
* Severity levels:

  * Low / Medium / High
* Dismissible alerts

---

### 📱 7. Attendee App View

* Simulated user-side experience:

  * Crowd navigation
  * Food pre-ordering
  * Notifications

---

### 👨‍💼 8. Staff Operations Panel

* Staff task management
* Communication logs
* Emergency protocols:

  * Medical
  * Security
  * Evacuation

---

## ⚙️ Tech Stack

* **Frontend:** React (Vite)
* **Styling:** Tailwind CSS
* **Charts:** Recharts
* **Icons:** Lucide React
* **Deployment:** Vercel

---

## 🧠 Core Architecture

### 🔹 Hooks

* `useVenue.js`

  * Central simulation engine
  * Generates:

    * Zones
    * Gates
    * Concessions
    * Alerts
    * Metrics

---

### 🔹 Components
```
| Component         | Purpose                   |
| ----------------- | ------------------------- |
| Header            | Top navigation + controls |
| MetricCard        | KPI display               |
| VenueMap          | Heatmap visualization     |
| GateManagement    | Gate analytics            |
| ConcessionTracker | Food stall tracking       |
| FlowAnalytics     | Charts & graphs           |
| AlertPanel        | Live alerts               |
```
---

### 🔹 Layout

* Tab-based navigation:

  * Overview
  * Crowd Map
  * Gates
  * Food & Bev
  * Analytics
  * Attendee
  * Staff Ops

---

## 🧪 Simulation Engine

The app uses a custom simulation system to mimic real-time behavior:

* Time-based updates (`tick`)
* Dynamic:

  * Crowd movement
  * Queue fluctuations
  * Alert generation
* Runs every second

---

## 📦 Installation

```bash
git clone https://github.com/sathwiksandesh/venue-management-system.git
cd venue-management-system
npm install
npm run dev
```

---

## 🚀 Deployment

Deployed using **Vercel**

Steps:

1. Push project to GitHub
2. Import into Vercel
3. Select **Vite preset**
4. Deploy

---

## 🎯 Key Highlights

* Real-time simulation logic
* Modular component architecture
* Interactive UI/UX
* Scalable dashboard design
* Production-ready structure

---

## 📌 Future Improvements

* Backend integration (real data)
* WebSocket live updates
* AI-based crowd prediction
* Mobile optimization
* Role-based access (Admin/Staff/User)

---

## 🙌 Acknowledgement

Built as a hands-on project to explore:

* Real-time dashboards
* Data visualization
* Scalable UI systems

---

## 📬 Contact

Feel free to connect or provide feedback!

---

⭐ If you like this project, give it a star!
