# Nike Store - Next.js App

A modern e-commerce application built with Next.js, TypeScript, Tailwind CSS, Better Auth, Neon PostgreSQL, Drizzle ORM, and Zustand.

## Features

- 🛍️ Product catalog with Nike items
- 🗄️ PostgreSQL database with Drizzle ORM
- 🔐 Authentication with Better Auth
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🏪 State management with Zustand

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **State Management**: Zustand
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js 18+
- A Neon PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up your environment variables in `.env.local`:

```env
# Database
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
```

3. Set up the database:

```bash
# Generate migration files
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with sample Nike products
npm run db:seed
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application includes a `products` table with the following fields:

- `id` - Primary key
- `name` - Product name
- `description` - Product description
- `price` - Product price
- `image` - Product image URL
- `category` - Product category
- `brand` - Product brand (defaults to Nike)
- `size` - Product size
- `color` - Product color
- `stock` - Available stock
- `isActive` - Product availability status
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── products/
│   │       └── route.ts
│   └── page.tsx
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── schema.ts
│   ├── seed.ts
│   └── store.ts
scripts/
└── seed.ts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
