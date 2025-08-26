# SeniorCare – Accessibility-First Elderly Care Assistant  

This repository contains my final year dissertation project: **SeniorCare**, an accessibility-first Android app with a caregiver admin panel, powered by a Node.js REST API and a MySQL database deployed on Railway.  

The goal of SeniorCare is to help seniors manage **appointments, medications, social events, and emergency contacts** through a simple, accessible UI, while caregivers can administer doctors and services via a secure admin panel.  

---

## 📱 Features  

### SeniorCare Mobile App (React Native, TypeScript)  
- **User registration/login** with secure authentication (JWT).  
- **Appointments**: book, reschedule, cancel, and view upcoming doctor visits.  
- **Medications**: add prescriptions and receive reminders.  
- **Events**: browse, join, and invite other seniors to social/community events.  
- **Emergency contacts**: one-tap call for help.  
- **Accessibility focus**: large text, clear layouts, reduced cognitive load.  

### Caregiver Admin Panel  
- Manage doctors (create, edit, delete profiles).  
- View appointments and medications linked to seniors.  
- Oversee events and user engagement.  

### Backend API (Node.js + MySQL on Railway)  
- RESTful API with **JWT authentication middleware**.  
- Secure environment-based configuration.  
- Hosted MySQL database (Railway) with ERD-driven schema.  
- Tested endpoints with Postman & black-box testing.  

---

## 🧰 Tech Stack  

**Frontend (Mobile App):**  
- React Native (TypeScript)  
- Styled Components / React Hooks  
- TanStack Query for state/data fetching  

**Backend (API):**  
- Node.js + Express  
- MySQL on Railway  
- Sequelize ORM  
- JWT authentication  

**Admin Panel:**  
- React (JavaScript)  
- Material UI  

**Other:**  
- Accessibility-first UI/UX design  
- Testing: Unit tests + black-box testing  
- Documentation: UML diagrams, ERD, Volere templates  

---

## 🚀 How to Run Locally  

1. Clone this repo.  
2. Install dependencies for the mobile app and backend:  
   ```bash
 cd mobile-app && npm install
   cd ../server && npm install

bash
npm run dev
Run the React Native app (Android emulator or real device):

bash
Copy code
npm run android


   cd mobile-app && npm install
   cd ../server && npm install
