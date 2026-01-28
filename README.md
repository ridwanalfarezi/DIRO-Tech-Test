# Pilates Booking Application

A modern, full-stack booking system for Pilates studios, featuring real-time availability, secure payments, and a premium user interface.

## Project Overview

This application serves as a technical demonstration of a reservation system. It allows users to:

- Browser available Pilates studios and time slots.
- Real-time filtering by date.
- Book sessions seamlessly.
- View booking confirmations.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) - For hybrid static/dynamic rendering and Server Actions.
- **Language**: [TypeScript](https://www.typescriptlang.org/) - For type safety and developer experience.
- **Database**: [SQLite](https://sqlite.org/) with [Prisma ORM](https://www.prisma.io/) - Chosen for zero-setup local development and type-safe database queries.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - For a responsive, design-system-first UI.
- **State Management**: [TanStack Query](https://tanstack.com/query) - For efficient server state management and caching.
- **Testing**: [Playwright](https://playwright.dev/) - For reliable end-to-end testing of critical flows.
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - For robust client-side validation.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (Preferred package manager)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd diro-tech-test
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory:

    ```env
    # Database (Defaults to local SQLite)
    DATABASE_URL="file:./dev.db"
    ```

4.  **Database Setup:**
    Initialize the SQLite database and seed initial data:

    ```bash
    npx prisma db push
    npx prisma db seed
    ```

5.  **Run Development Server:**
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Running Tests

End-to-end tests are implemented using Playwright.

```bash
# Run all E2E tests
npx playwright test

# Run tests in UI mode (interactive)
npx playwright test --ui
```

## Project Structure

- **`app/`**: Next.js App Router pages and API routes.
- **`actions/`**: Server Actions for data mutations (bookings, payments).
- **`components/`**: Reusable UI components.
  - **`booking/`**: Domain-specific components for the booking flow.
  - **`ui/`**: Generic, design-system components (buttons, cards, inputs).
- **`hooks/`**: Custom React hooks (e.g., `useSessions` for availability fetching).
- **`lib/`**: Utilities, configuration, and external service clients (Prisma, Xendit).
- **`prisma/`**: Database schema and seed scripts.
- **`e2e/`**: Playwright test specifications.

## Key Technical Decisions

1.  **Server Actions for Mutations**: We use Server Actions (`actions/booking.ts`, `actions/payment.ts`) instead of REST API endpoints for form submissions to simplify data flow and leverage Next.js built-in progressive enhancement.
2.  **SQLite for Dev**: SQLite is used to ensure the project works immediately after cloning without requiring a Docker container or external database service.
3.  **Optimistic UI**: The app uses React Query to pre-fetch availability, ensuring immediate feedback when switching dates, with stale-while-revalidate strategies for freshness.
4.  **Strict Component Boundaries**: `components/ui` contains only "dumb" visual components, while `components/booking` contains domain-aware logic. This separation ensures the design system remains reusable.

## Assumptions & Limitations

- **Authentication**: Implementing full RBAC (Role-Based Access Control) is prepared in the data model (`Role`, `Permission`) but simplified for the public booking flow.
- **Time Zones**: All times are currently handled in the server's local time or simplified UTC. Production systems would require stricter timezone handling (e.g., storing in UTC, displaying in Studio's local time).
