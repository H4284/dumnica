# Dumnica

Website for Dumnica Group, built with Next.js and Sanity CMS.

## Tech Stack

* Next.js
* TypeScript
* Tailwind CSS
* Sanity CMS
* GROQ
* ESLint
* Prettier

## Getting Started

Install the dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Build

To create a production build:

```bash
npm run build
```

## Project Structure

```text
app/          → Pages and routes
components/   → Reusable UI components
lib/          → Helper functions and shared logic
sanity/       → Sanity CMS configuration and schemas
public/       → Static assets
```

## Routing

The project uses the Next.js App Router.

Each page has a real URL and is designed to be server-rendered for better SEO.

## Sanity CMS

Sanity is used to manage website content, including buildings and units.

Content is fetched from Sanity using GROQ queries.

## Development Workflow

Do not work directly on `main`.

Create a new branch for each task:

```bash
git checkout -b feature/task-name
```

After completing the work:

1. Commit the changes
2. Push the branch
3. Open a Pull Request
4. Get the changes reviewed
5. Merge into `main`
