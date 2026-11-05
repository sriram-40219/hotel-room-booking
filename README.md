# Hotel Room Booking System - Web Application

A modern and responsive Hotel Room Booking Web Application developed for the Semester In-Lab examination.

## Features
- **Responsive Navigation & Hero Section**: Clean interface with fast navigation.
- **Room Showcase & Category Filter**: Displays Single, Double, and Luxury Suites with rates, occupancy, and amenities.
- **Dynamic Booking & Reservation Form**:
  - Live cost breakdown (Nights, Room Charges, Add-ons, GST, Grand Total).
  - Date validations (ensuring check-out is after check-in).
  - Optional add-on services (Buffet Breakfast, Airport Pickup).
- **Instant Booking Confirmation & Receipt**:
  - Generates unique reference IDs.
  - Printable receipt modal (`window.print()`).
- **Local Storage Integration**: Saves reservations locally with options to view and cancel active bookings.

## Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla ES6+)
- **Backend / Dev Server**: Node.js HTTP Server (`server.js`)

## Getting Started
1. Clone this repository:
   ```bash
   git clone <repo-url>
   cd Sem-inlab
   ```
2. Start the local server:
   ```bash
   node server.js
   ```
3. Open `http://localhost:8080` in your web browser, or directly open `index.html`.
