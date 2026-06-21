# Audiophile E-Commerce

A premium e-commerce platform for audio equipment built with Next.js 16, React 19, and TypeScript. Features a full product catalog across headphones, speakers, and earphones categories with a responsive design and checkout-ready architecture.

[View Live Demo](https://audiophile-ecommerce.vercel.app) | [Frontend Mentor Profile](https://www.frontendmentor.io/profile/dev0xgenius)

---

## Features

- Product catalog with categories (Headphones, Speakers, Earphones)
- Featured product showcase with hero section
- Responsive design with mobile, tablet, and desktop layouts
- Cart system with checkout form (react-hook-form + Zod validation)
- Modern UI with Tailwind CSS v4 and custom components
- Optimized images with Next.js Image component

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS v4, shadcn/ui-style components
- **Forms:** react-hook-form, Zod, @radix-ui/react-label
- **Icons:** lucide-react
- **Build:** Turbopack (dev), PostCSS

## Getting Started

```bash
git clone https://github.com/dev0xgenius/audiophile-ecommerce.git
cd audiophile-ecommerce
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
 app/            # Next.js App Router pages
   layout.tsx    # Root layout with header, hero, footer
   page.tsx      # Home page with categories + products
 components/
   ui/
     header.tsx         # Navigation with cart + hamburger menu
     footer.tsx         # Site footer
     product-card.tsx   # Reusable product card component
     category-card.tsx  # Category navigation card
     form.tsx           # Form components (react-hook-form)
     button.tsx         # Styled button component
     home/
       hero.tsx         # Hero section
       product-list.tsx # Featured products grid
       category-list.tsx# Category navigation
       about-info.tsx   # About section
 assets/          # Images organized by product/category
 public/          # Static assets
```

## Build

```bash
npm run build
npm start
```

## Author

**0xgenius** - [GitHub](https://github.com/dev0xgenius)
