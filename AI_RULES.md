# AI Rules for CVMate Development

This document outlines the core technologies used in the CVMate application and provides clear guidelines on which libraries and frameworks to use for specific functionalities. Adhering to these rules ensures consistency, maintainability, and leverages the strengths of our chosen tech stack.

## Tech Stack Overview

*   **Framework**: Next.js 14 with App Router for server-side rendering, routing, and API routes.
*   **Language**: TypeScript for type safety and improved code quality across the entire codebase.
*   **Styling**: Tailwind CSS for utility-first styling, ensuring responsive and consistent UI design.
*   **UI Components**: Shadcn/ui for pre-built, accessible, and customizable UI components.
*   **Database**: MongoDB as the NoSQL database, managed with Mongoose for schema definition and interaction.
*   **Authentication**: NextAuth.js for secure authentication, supporting Google OAuth and custom email/password login with JWT.
*   **AI Integration**: Google Generative AI (Gemini) for intelligent resume optimization and analytics.
*   **PDF Generation**: Puppeteer (via `@sparticuz/chromium`) for server-side, high-fidelity PDF rendering of resumes.
*   **HTTP Client**: Axios for making robust and interceptable API requests to the backend.
*   **Form Management**: React Hook Form for efficient form handling and Zod for schema-based validation.
*   **Notifications**: Sonner for elegant and user-friendly toast notifications.
*   **Icons**: Lucide React for a comprehensive set of customizable SVG icons.
*   **Image Management**: Cloudinary for image storage and optimization, integrated with `react-easy-crop` for client-side cropping.
*   **Animations**: Lottie React for integrating rich, vector-based animations.
*   **Carousel**: Embla Carousel React for touch-friendly and customizable carousels.

## Library Usage Guidelines

To maintain a consistent and efficient development workflow, please adhere to the following rules when implementing features:

1.  **UI Components**:
    *   **Always** prioritize `shadcn/ui` components for building the user interface.
    *   If a specific `shadcn/ui` component does not exist or requires significant customization, create a **new component** in `src/components/` that either wraps existing `shadcn/ui` primitives or uses basic HTML/Tailwind.
    *   **Never** modify files directly within `components/ui/`.
2.  **Styling**:
    *   **Exclusively** use Tailwind CSS classes for all styling. Avoid inline styles unless absolutely necessary for dynamic, computed values (e.g., `backgroundColor` derived from a prop).
    *   Ensure designs are responsive across various screen sizes.
3.  **Icons**:
    *   **Always** use icons from the `lucide-react` library.
4.  **Forms & Validation**:
    *   **Always** use `react-hook-form` for managing form state and submissions.
    *   **Always** use `zod` for defining form schemas and performing validation.
5.  **API Calls**:
    *   **Always** use the `axios` instance defined in `lib/axios.ts` for all API requests to the backend. This ensures consistent error handling and authentication.
6.  **Authentication**:
    *   For Google OAuth, use `next-auth`.
    *   For email/password authentication, use the custom JWT-based system implemented in `app/api/auth/login` and `lib/auth.ts`.
7.  **Database Interaction**:
    *   In API routes, **always** use `mongoose` models (e.g., `User`, `Resume`) for interacting with MongoDB.
8.  **PDF Generation**:
    *   The PDF generation logic relies on `puppeteer-core` and `@sparticuz/chromium` in the `/api/generate-pdf` route. Do not attempt alternative PDF generation methods.
9.  **AI Features**:
    *   Integrate AI functionalities using the `resumeOptimizer` service from `lib/gemini.ts`.
10. **Notifications**:
    *   **Always** use `sonner` for displaying all user notifications (success, error, info).
11. **Animations**:
    *   For Lottie animations, use the `lottie-react` component.
12. **Image Cropping**:
    *   For client-side image cropping, use `react-easy-crop`.
13. **Carousels**:
    *   For any carousel implementations, use `embla-carousel-react`.
14. **State Management**:
    *   For global or complex state shared across multiple components, prefer the React Context API (e.g., `ResumeContext`).
    *   For local component state, use React's `useState` and `useReducer` hooks.