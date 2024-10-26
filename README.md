# 🖥️ Point of Sale (POS) System - Backend (Server)

## 📝 Description
This repository contains the backend code for the **Smart Point of Sale (POS) System**, designed using a **microservices architecture**. The backend is powered by **Node.js**, **TypeScript**, **PostgreSQL**, and fully containerized using **Docker** for scalable and efficient deployment. It handles core services such as user authentication, inventory management, product catalog, sales, and payment processing.

### 🧩 **Microservices Architecture**
The system is built using a **microservices** approach, where each core feature—like user management, inventory, and payment processing—is managed by independent services that communicate over APIs. This ensures:
- 🔄 **Scalability**: Services can scale independently based on load.
- 🛠️ **Modularity**: Easy to maintain and upgrade each service without affecting others.
- 🔐 **Security**: Each service has its own security layers.

## 🛠️ Tech Stack
- **🟢 Node.js** with **TypeScript** – Fast, scalable server-side processing
- **🐘 PostgreSQL** – Robust relational database
- **⚙️ TypeORM** – Powerful ORM for managing database connections and models
- **🐳 Docker** – Containerization for easy and consistent deployments
- **🔑 JWT** – Secure authentication and authorization
- **🔒 bcryptjs** – Strong password hashing for user security

## ⚙️ Features
- 👤 **User Management** with role-based access control (Admin, Cashier, Manager)
- 🏪 **Real-time Inventory Management** with automatic stock updates
- 🛒 **Product Catalogue** (Create, Read, Update, Delete operations)
- 💳 **Sales & Payment Processing** supporting multiple payment methods
- 🔐 **JWT-based Authentication** for secure user sessions
- 👨‍💼 **Super Admin Setup** for centralized control using migrations

## 🐳 **Docker** & Microservices Deployment
The backend is fully containerized using **Docker** 🐳, making it portable and easy to deploy across any environment. Each microservice runs in its own Docker container, ensuring **isolation**, **scalability**, and **fault tolerance**.

### **Key Docker Features**:
- **Docker Compose**: Used to manage multi-container applications with a single command.
- **Scaling**: Easily scale specific services using Docker's scaling capabilities.
- **Network Management**: Microservices communicate internally within the Docker network, ensuring smooth interaction without external exposure.

## 🚀 Installation & Setup

### Prerequisites
- 🐳 **Docker** and **Docker Compose** installed
- 🟩 **Node.js** (v14 or higher)
- 🐘 **PostgreSQL** – Set up locally or use a cloud database service like Heroku

### 📦 Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Smart-POS-System/Server.git
   ```

2. **Install server dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:  
   Rename the `.env.example` file to `.env` and configure your database and JWT secrets.

4. **Start the services with Docker**:
   ```bash
   docker-compose up -d --build
   ```

5. **Run Backend Tests**:
   Ensure everything is running correctly by testing the backend:
   ```bash
   npm run test
   ```

### 💡 Key Commands:
- **Start services**:
  ```bash
  docker-compose up -d
  ```
- **Stop services**:
  ```bash
  docker-compose down
  ```
- **View logs**:
  ```bash
  docker-compose logs -f
  ```

## 🧪 **Testing**
Use the built-in tests to validate functionality and ensure all services are working:
```bash
npm run test
```
We recommend running tests before deploying to ensure smooth operation of the POS system.

## 🤝 Contributions
We welcome all contributions to improve this POS system. If you want to contribute, feel free to open an issue or submit a pull request. 🙌

## 🛡️ License
This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

