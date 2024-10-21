# Point of Sale (POS) System - Server

## Description
This repository contains the backend code for the Point of Sale (POS) system, implemented with a microservices architecture. The backend is built with **Node.js**, **TypeScript**, **PostgreSQL**, and **Docker**. It manages key services like user authentication, inventory management, product catalog, sales, and payments.

## Tech Stack
- **Node.js** with **TypeScript**
- **PostgreSQL** (Database)
- **TypeORM** (ORM)
- **Docker** (Containerization)
- **JWT** for authentication
- **bcryptjs** for password hashing

## Features
- User management with role-based access control
- Real-time inventory management
- Product catalogue (CRUD operations)
- Sales transactions and payment processing
- JWT-based authentication
- Super admin (General Manager) setup via the migration service

## Installation

### Prerequisites
- **Docker** and **Docker Compose** installed
- **Node.js** (v14 or higher)
- **PostgreSQL**

### Setup
1. Clone the repository:
   ```bash
   https://github.com/Smart-POS-System/Server.git
2. Install server and client dependencies:
   ```bash
   npm install
3. Start the services with Docker:
   ```bash
   docker-compose up -d --build
4. Run Backend Tests:
   ```bash
   npm run test
