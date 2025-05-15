# QuickCart Monorepo

![QuickCart Logo](./assets/logo.png)

> Your Shopping Companion

## 📱 Overview

QuickCart is a mobile application that transforms the in-store shopping experience by allowing customers to scan products using their smartphone, automatically generating a digital cart, and providing a single scannable barcode at checkout for quick payment and exit.

Developed by S.P TSHABALALA (PTY) LTD, QuickCart aims to reduce checkout time and improve the shopping experience at partner stores like Pick n Pay and ShopRite.

## ✨ Features

- **Product Scanning**: Scan product barcodes in-store using your phone's camera
- **Digital Cart Management**: Automatically add scanned items to your cart with details and pricing
- **Easy Checkout**: Generate a single scannable QR code that represents your entire cart
- **Fast Payment**: Show the generated code at checkout for quick processing
- **User Accounts**: Create and manage your shopping profile (optional)

## 🖼️ Screenshots

<!-- Replace with actual screenshots once available -->
![Welcome Screen](./screenshots/welcome.png)
![Scanning Screen](./screenshots/scanning.png)
![Cart Screen](./screenshots/cart.png)
![Checkout Screen](./screenshots/checkout.png)

## 🛠️ Technology Stack

### Monorepo Structure
- **Package Manager**: pnpm with workspaces
- **Build System**: Turborepo

### Backend
- **API**: tRPC for end-to-end typesafe APIs
- **Runtime**: Node.js with Nodemon for development
- **Database**: PostgreSQL
- **ORM**: Prisma Client
- **Containerization**: Docker & Docker Compose
- **Authentication**: NextAuth.js (adaptable for tRPC)

### Frontend
- **Framework**: Ionic with React
- **State Management**: React Query (works well with tRPC)
- **Styling**: Tailwind CSS
- **Barcode Scanning**: Capacitor plugins

## 🚀 Installation

### Prerequisites

- Node.js (v16+)
- pnpm (v7+)
- Docker & Docker Compose
- iOS/Android development environment for mobile testing

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/username/quickcart.git

# Navigate to the project directory
cd quickcart

# Install dependencies
pnpm install

# Set up environment variables
cp packages/backend/.env.example packages/backend/.env
cp packages/mobile/.env.example packages/mobile/.env

# Start the development environment
pnpm dev