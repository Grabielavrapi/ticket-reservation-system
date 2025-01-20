# Ticket Reservation System 🎫

A simple and reliable ticket reservation system built to demonstrate best practices in reliable programming, including error handling, data redundancy, and testing. This project allows users to book tickets for events while ensuring robust functionality and fault tolerance.

## 📌 Features

- **Event Selection:** Users can browse and select events to reserve tickets.
- **User Data Management:** Stores user details securely in a database with redundancy.
- **Error Handling:** Handles invalid input and server/database failures gracefully.
- **Data Redundancy:** Ensures data integrity with backup storage.
- **Testing:** Includes unit and integration tests to verify functionality.
- **Failure Simulation:** Implements a simple "Chaos Monkey" for simulating failures like database unavailability.

## ⚙️ Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (or a JSON-based solution for simplicity)
- **Testing:** Jest/Mocha

## 🚀 Getting Started

### Prerequisites
- Node.js installed (v16+ recommended)
- MongoDB (or use a JSON-based database for development)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/username/ticket-reservation-system.git
