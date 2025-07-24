# React + Vite + TypeScript Starter

This is a minimal starter template for building modern web applications using **React**, **Vite**, and **TypeScript**. It's configured for a fast development experience with Hot Module Replacement (HMR) and includes a solid foundation for ESLint.

---

## Features

- **⚡️ Next-gen Frontend Tooling:** [Vite](https://vitejs.dev/) for blazing fast server starts and builds.
- **⚛️ Modern UI Framework:** [React](https://react.dev/) for building dynamic user interfaces.
- **🔒 Type Safety:** [TypeScript](https://www.typescriptlang.org/) for robust and maintainable code.
- **🔄 Fast Refresh:** Hot Module Replacement (HMR) for an instant feedback loop during development.
- **🧹 Code Quality:** Pre-configured with [ESLint](https://eslint.org/) to enforce coding standards.

---

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Make sure you have the following software installed:

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) or another package manager like [Yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/joao-cainglet/fss-va-2025.git
    cd fss-va-2025/frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

---

## Available Scripts

In the project directory, you can run the following commands:

### `npm run dev`

Starts the development server with Hot Module Replacement (HMR) enabled. Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in your browser.

### `npm run build`

Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run lint`

Runs the ESLint configuration to analyze your code for potential errors and style issues.

### `npm run preview`

Starts a local static web server that serves the files from your `dist` folder. It's a useful way to check your production build locally before deploying.

---

## Vite React Plugins

This template can be configured with one of two official plugins for React integration:

- **`@vitejs/plugin-react`**: Uses [Babel](https://babeljs.io/) for Fast Refresh. It's robust and has wide ecosystem support.
- **`@vitejs/plugin-react-swc`**: Uses [SWC](https://swc.rs/) for Fast Refresh. It's significantly faster and is a great choice for performance-critical projects.

---

## Expanding the ESLint Configuration

For a production-ready application, it's recommended to enhance the default ESLint setup.

### Enabling Type-Aware Linting

Type-aware linting allows ESLint to use your TypeScript type information to catch more complex errors. Update your `eslint.config.js` to enable it:

```javascript
// eslint.config.js
import tseslint from 'typescript-eslint';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Replace tseslint.configs.recommended with this for type-aware rules
      ...tseslint.configs.recommendedTypeChecked,

      // Or use this for even stricter rules
      // ...tseslint.configs.strictTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
```
