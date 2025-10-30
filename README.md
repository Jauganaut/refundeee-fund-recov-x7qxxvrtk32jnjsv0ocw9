# Refundeee

_Your Trusted Partner in Fund Recovery_

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Jauganaut/refundeee)

A professional platform for users to submit and track fund recovery cases, featuring a comprehensive case submission form and a secure user dashboard. This project is a full-stack, serverless application built on the Cloudflare stack.

## About The Project

Refundeee is a modern, professional, and visually stunning web application designed to be a trusted partner in fund recovery. It provides a platform for users who have been victims of scams to submit their cases for potential recovery. The application features a comprehensive, multi-step sign-up form to gather all necessary case details, a secure user dashboard to track case progress and payment status, and a simulated crypto-payment system for a mandatory facilitator's fee.

This application is built on Cloudflare's high-performance, serverless infrastructure, utilizing Durable Objects for state management, ensuring reliability and scalability.

**Disclaimer:** This application is a project built to showcase modern web development capabilities and is not affiliated with any existing fund recovery service. It is designed for demonstration purposes only.

## Key Features

*   **Comprehensive Case Submission:** A multi-step sign-up form to gather all necessary case details in a user-friendly manner.
*   **Secure User Dashboard:** An authenticated area for users to view their account information, track case status, and manage payments.
*   **Simulated Crypto Payments:** A dedicated page for users to pay the facilitator's fee using a simulated cryptocurrency checkout system.
*   **Admin Panel:** A protected area for administrators to manage users, cases, and platform settings (to be implemented in a later phase).
*   **Serverless Architecture:** Built entirely on the Cloudflare stack for global performance, scalability, and reliability.

## Tech Stack

This project is a full-stack application built with a modern, serverless architecture.

*   **Frontend:**
    *   [React](https://react.dev/)
    *   [Vite](https://vitejs.dev/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [shadcn/ui](https://ui.shadcn.com/)
    *   [Framer Motion](https://www.framer.com/motion/)
    *   [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for form validation
    *   [Zustand](https://zustand-demo.pmnd.rs/) for state management

*   **Backend:**
    *   [Hono](https://hono.dev/) on [Cloudflare Workers](https://workers.cloudflare.com/)

*   **Database / State Management:**
    *   [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)

*   **Deployment:**
    *   [Cloudflare Pages](https://pages.cloudflare.com/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   [Bun](https://bun.sh/) installed on your machine.
*   A [Cloudflare account](https://dash.cloudflare.com/sign-up).
*   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/refundeee_fund_recovery.git
    cd refundeee_fund_recovery
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```sh
    bun install
    ```

## Usage

To start the development server, run:

```sh
bun dev
```

This command will start the Vite frontend development server and the Hono backend worker simultaneously. The frontend will be available at `http://localhost:3000` (or the port specified by the `PORT` environment variable), and API requests from the frontend to `/api/*` will be automatically proxied to the local worker.

## Backend (API)

The backend is a serverless API built with Hono, running on Cloudflare Workers.

*   **API Routes:** All API routes are defined in `worker/user-routes.ts`.
*   **State Management:** The application uses a single Cloudflare Durable Object class (`GlobalDurableObject`) to manage state for multiple entities (e.g., Profiles, Cases). This provides a robust, KV-like storage system with transactional guarantees.
*   **Entities:** Data models are defined as `Entity` classes in `worker/entities.ts`. These classes provide a simple abstraction layer for interacting with the Durable Object storage.

## Deployment

This project is designed for seamless deployment to Cloudflare Pages.

1.  **Build the application:**
    ```sh
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    The `deploy` script in `package.json` handles both the build and deployment process.
    ```sh
    bun run deploy
    ```
    This will build the Vite frontend and deploy the application along with the worker functions using Wrangler.

### One-Click Deploy

You can also deploy this project to your own Cloudflare account with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Jauganaut/refundeee)