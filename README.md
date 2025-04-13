# VitaMap

An app for users to find availability of medicine in nearby pharmacies and for pharmacies to manage their inventory.

Deployed at: [VitaMap](https://vitamap-kappa.vercel.app/)
Demonstartion Video: [VitaMap Demo](https://drive.google.com/drive/folders/1Cf9OV613aU8ZzLD5WBJztGbt2GW5ii1I)

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

3. **Configure environment variables**:

   - Create or update the `.env` file with the following:

     ```env
     # Database configuration
     POSTGRES_URL=postgres://<username>:<password>@<host>/<database>?connect_timeout=15&sslmode=require

     # JWT configuration
     JWT_SECRET=<your-secure-random-string>
     ```

   - For the JWT_SECRET, generate a secure random string using:

     ```bash
     # macOS/Linux
     openssl rand -base64 32

     # Windows users can generate a secret at:
     # https://generate-secret.vercel.app/32
     ```

4. **Configure Prisma**:

   - Ensure you have a PostgreSQL database running.
   - Update the `.env` file with your database connection string. Example:
     ```env
     POSTGRES_URL=postgres://<username>:<password>@<host>/<database>?connect_timeout=15&sslmode=require
     ```
   - Generate the Prisma client:
     ```bash
     pnpm prisma generate --schema=db/prisma/schema.prisma
     ```

5. **Run database migrations**:

   ```bash
   pnpm prisma migrate dev --schema=db/prisma/schema.prisma
   ```

6. **Configure Chatbot Installation**
   [Chatbot README](./backend/README.md)

6. **Start the development server**:
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

4. **Medicine Search**:

   - Users can search for medicines and view availability in nearby pharmacies.
   - Medicine examples such as Cetirizine, Paracetamol, etc.

5. **Interactive Map**:

   - Integrated with Leaflet to display pharmacies on a map.

6. **Chatbot**

   - OpenAI powered chatbot 

#### Constraints on current feature -

1. Pharmacies can curretnly provide their location manually or with by providing current location
2. Search medicine returns all the medicine in the database matching irrespctive of pharmacy's location from user's location.
3. Inconsistent UI
4. Limited Map Interactivity
5. Chatbot web service is not integrated with the app. Need of local configuration.

### Upcoming Features

- Autocomplete and suggestion based on search input
- Filter of returned pharmacies based on distance, currently open, prescription required.
- Display alternative medicines if the searched one is not available.
- Provide insights to the Pharmacies regarding their inventory.
- Ad Promotion


## Dependency Graph

### Dependencies

- `@hookform/resolvers`: Resolver utilities for React Hook Form.
- `@prisma/client`: Prisma client for database interaction.
- `@radix-ui/react-alert-dialog`: Radix UI component for alert dialogs.
- `@radix-ui/react-checkbox`: Radix UI component for checkboxes.
- `@radix-ui/react-dialog`: Radix UI component for dialogs.
- `@radix-ui/react-label`: Radix UI component for labels.
- `@radix-ui/react-navigation-menu`: Radix UI component for navigation menus.
- `@radix-ui/react-select`: Radix UI component for select inputs.
- `@radix-ui/react-slider`: Radix UI component for sliders.
- `@radix-ui/react-slot`: Radix UI component for slots.
- `@radix-ui/react-tooltip`: Radix UI component for tooltips.
- `bcryptjs`: Library for hashing passwords.
- `class-variance-authority`: Utility for managing class names.
- `clsx`: Utility for conditionally joining class names.
- `cmdk`: Command menu component.
- `cookie`: HTTP cookie parsing and serialization.
- `framer-motion`: Animation library for React.
- `jose`: JavaScript Object Signing and Encryption library for JWT.
- `leaflet`: JavaScript library for interactive maps.
- `lucide-react`: React components for Lucide icons.
- `next`: React framework for server-side rendering and static site generation.
- `react`: Library for building user interfaces.
- `react-dom`: React package for working with the DOM.
- `react-hook-form`: Library for managing forms in React.
- `react-icons`: Icon library for React.
- `react-leaflet`: React components for Leaflet maps.
- `react-slick`: React carousel component.
- `react-tsparticles`: Particles animation library for React.
- `slick-carousel`: Carousel/slider component.
- `tailwind-animate`: Animation utilities for Tailwind CSS.
- `tailwind-merge`: Utility for merging Tailwind CSS classes.
- `tailwindcss-animate`: Animation plugin for Tailwind CSS.
- `tsparticles`: Particles animation library.
- `zod`: TypeScript-first schema validation library.

### DevDependencies

- `@eslint/eslintrc`: ESLint configuration utilities.
- `@tailwindcss/postcss`: Tailwind CSS PostCSS plugin.
- `@types/leaflet`: TypeScript definitions for Leaflet.
- `@types/node`: TypeScript definitions for Node.js.
- `@types/react`: TypeScript definitions for React.
- `@types/react-dom`: TypeScript definitions for React DOM.
- `@types/react-slick`: TypeScript definitions for React Slick.
- `autoprefixer`: PostCSS plugin to parse CSS and add vendor prefixes.
- `eslint`: Linting tool for code quality.
- `eslint-config-next`: ESLint configuration for Next.js.
- `postcss`: Tool for transforming CSS with JavaScript plugins.
- `prisma`: ORM for database schema and migrations.
- `tailwindcss`: Utility-first CSS framework.
- `typescript`: TypeScript support for type safety.
