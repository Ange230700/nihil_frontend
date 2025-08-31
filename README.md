<!-- README.md -->

# Nihil Frontend

A modern **React + TypeScript** progressive web application (PWA) built with **Vite**.
It powers the **Nihil** social platform frontend — integrating **users** and **posts** services with a strong focus on security, accessibility, offline-first support, and developer experience.

<!-- ![Screenshot](link-to-screenshot.png) -->

---

## ✨ Features

- **Users & Posts**
  Create, list, and search users and posts with pagination.
- **Authentication ready**
  CSRF protection, session refresh, and session-expired event handling.
- **Internationalization (i18n)**
  English & French with runtime catalog updates and local caching.
- **Theming**
  Light/dark theme with dynamic PrimeReact theme switching.
- **PWA support**
  Offline caching, update prompts, and iOS splash screens/icons.
- **Robust DX**
  Type-safe API schemas with Zod, React Query for caching, MSW for tests.
- **Accessibility & Security**
  WCAG contrast auditing, safe HTML rendering with DOMPurify, strict CSP.

---

## 🛠 Tech Stack

**Core**

- [React 19](https://react.dev/) + [React Router](https://reactrouter.com/)
- [Vite 7](https://vitejs.dev/) + SWC compiler
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/) with design tokens
- [PrimeReact 10](https://primereact.org/) + PrimeIcons

**Data & Validation**

- [TanStack Query](https://tanstack.com/query/latest)
- [Zod](https://zod.dev/) for runtime validation
- [Axios](https://axios-http.com/) with CSRF + refresh interceptors

**Testing**

- [Vitest](https://vitest.dev/) with [Testing Library](https://testing-library.com/)
- [MSW](https://mswjs.io/) for API mocking
- Faker for deterministic test data

**Tooling & CI**

- ESLint (strict + React plugins) & Prettier (with Tailwind plugin)
- Husky + lint-staged + commitlint + commitizen
- GitHub Actions CI (lint, type-check, tests, build)

---

## 🚀 Getting Started

### Prerequisites

- Node.js **20+**
- npm **9+**

### Installation

```bash
git clone https://github.com/Ange230700/nihil_frontend.git
cd nihil_frontend
npm install
npm run copy-envs # or manually copy .env.sample to .env
```

### Running in Dev

```bash
npm run dev
```

### Building for Prod

```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
├── src/
│   ├── api/           # axios clients, CSRF bootstrap
│   ├── app/           # bootstrap providers (theme, i18n, csrf)
│   ├── components/    # shared UI components
│   ├── contexts/      # React contexts (toast, theme, i18n)
│   ├── entities/      # domain entities (user, post) with schemas/hooks/api
│   ├── features/      # feature-level UI (forms, lists, etc.)
│   ├── i18n/          # locale JSON + versioning
│   ├── routes/        # router, layouts, error boundaries
│   ├── shared/        # hooks, forms, utils, a11y helpers
│   └── tests/         # MSW handlers, fixtures, utilities
├── public/            # PWA assets, icons, prime themes
├── build/             # custom vite plugins (e.g. i18nVersionPlugin)
└── .github/workflows/ # CI configuration
```

---

## 🔑 Environment Variables

Copy `.env.sample` → `.env` and fill in:

```env
VITE_USER_SERVICE_API_URL=http://localhost:4000/api
VITE_POST_SERVICE_API_URL=http://localhost:4001/api
VITE_CSRF_COOKIE_NAME=XSRF-TOKEN
VITE_CSRF_HEADER_NAME=X-CSRF-TOKEN
```

---

## 🧪 Testing

Run the full test suite:

```bash
npm test
```

Watch mode with UI:

```bash
npm run test:ui
```

Tests use **Vitest + Testing Library + MSW** for deterministic and network-free test runs.

---

## 📦 Deployment

- **CI/CD**: GitHub Actions runs type-check, lint, tests, and build on push/PR.
- **Hosting**: Works seamlessly on Vercel, Render, Netlify, or any static host.
- **PWA**: `vite-plugin-pwa` generates the manifest, service worker, and iOS assets.

---

## 🤝 Contributing

1. Fork & clone
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit with commitizen: `npm run commit`
4. Push and open a PR 🚀

---

## 📜 License

MIT License © 2025 [Ange KOUAKOU](https://github.com/Ange230700)

<!-- ---

## 🙏 Acknowledgements

* [React](https://react.dev/)
* [Vite](https://vitejs.dev/)
* [PrimeReact](https://primereact.org/)
* [TanStack Query](https://tanstack.com/query)
* [MSW](https://mswjs.io/) -->
