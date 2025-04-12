# VitaMap

An app for users to find availability of medicine in nearby pharmacies and for pharmacies to manage their inventory.

## Development Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/akasr/vitamap.git
   cd vitamap
   ```

2. **Install dependencies**:

   ```bash
   pnpm i
   ```

3. **Configure Prisma**:

   - Ensure you have a PostgreSQL database running.
   - Update the `.env` file with your database connection string. Example:
     ```env
     POSTGRES_URL=postgres://<username>:<password>@<host>/<database>?connect_timeout=15&sslmode=require
     ```
   - Generate the Prisma client:
     ```bash
     pnpm prisma generate --schema=db/prisma/schema.prisma
     ```

4. **Run database migrations**:

   ```bash
   pnpm prisma migrate dev --schema=db/prisma/schema.prisma
   ```

5. **Start the development server**:
   ```bash
   pnpm dev
   ```

## Features

### Completed Features
1. **Pharmacy Registration**:

   - Pharmacies can sign up and log in using email and password.
   - Passwords are securely hashed using bcrypt.

2. **Inventory Management**:

   - Pharmacies can add, update, and delete inventory items.

3. **Responsive UI**:
   - Built with Tailwind CSS and ShadCN for a modern and responsive design.

### Upcoming Features

1. **Medicine Search**:

   - Users can search for medicines and view availability in nearby pharmacies.

2. **Interactive Map**:

   - Integrated with Leaflet to display pharmacies on a map.



## Dependency Graph

### Dependencies

- `@hookform/resolvers`: Resolver utilities for React Hook Form.
- `@prisma/client`: Prisma client for database interaction.
- `@radix-ui/react-checkbox`: Radix UI component for checkboxes.
- `@radix-ui/react-label`: Radix UI component for labels.
- `@radix-ui/react-slot`: Radix UI component for slots.
- `bcryptjs`: Library for hashing passwords.
- `class-variance-authority`: Utility for managing class names.
- `clsx`: Utility for conditionally joining class names.
- `leaflet`: JavaScript library for interactive maps.
- `lucide-react`: React components for Lucide icons.
- `next`: React framework for server-side rendering and static site generation.
- `react`: Library for building user interfaces.
- `react-dom`: React package for working with the DOM.
- `react-hook-form`: Library for managing forms in React.
- `react-leaflet`: React components for Leaflet maps.
- `tailwind-merge`: Utility for merging Tailwind CSS classes.
- `tw-animate-css`: Tailwind CSS plugin for animations.
- `zod`: TypeScript-first schema validation library.

### DevDependencies

- `@eslint/eslintrc`: ESLint configuration utilities.
- `@tailwindcss/postcss`: Tailwind CSS PostCSS plugin.
- `@types/leaflet`: TypeScript definitions for Leaflet.
- `@types/node`: TypeScript definitions for Node.js.
- `@types/react`: TypeScript definitions for React.
- `@types/react-dom`: TypeScript definitions for React DOM.
- `eslint`: Linting tool for code quality.
- `eslint-config-next`: ESLint configuration for Next.js.
- `prisma`: ORM for database schema and migrations.
- `tailwindcss`: Utility-first CSS framework.
- `typescript`: TypeScript support for type safety.
