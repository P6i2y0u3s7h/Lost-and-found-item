# Student Item Recovery App (Lost & Found)

A simple, deployable web app for campuses. Built with **HTML/CSS/JS**. Works offline using **LocalStorage** for demo, and includes **Firebase** stubs for production.

## Features
- Post lost/found item with image & details
- Filter by category, type, date, location, and text
- Contact via email or WhatsApp
- Demo data seeding
- Responsive, modern UI

## Quick Start
1. Open `index.html` directly, or use VS Code **Live Server**.
2. Post a few items and try filters.
3. Items persist in your browser via LocalStorage.

## Firebase (optional)
1. Create a Firebase project (Firestore + Storage).
2. In `index.html`, uncomment Firebase SDK `<script>` tags.
3. In `app.js`, fill `firebaseConfig`, uncomment Firebase block, and remove LocalStorage functions.
4. Deploy with Firebase Hosting (optional).

## Project Structure
- `index.html` – UI markup
- `styles.css` – styling
- `app.js` – logic and storage
- `README.md` – this file

---
Made for students. Adapt freely.
