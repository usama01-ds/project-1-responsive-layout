# Project 1: Responsive Frontend Architecture

A modern, framework-free responsive web interface built for the **DecodeLabs Full Stack Internship Program (Batch 2026)**.

---

## 📌 Project Overview
This project focuses on building a dynamic, accessible, and fully responsive frontend layout using pure web fundamentals (HTML5, CSS3, JavaScript). It adheres strictly to the mobile-first development paradigm and 2025 UI/UX design standards.

---

## 🛠️ Tech Stack & Constraints
- **HTML5**: Semantic landmarks for screen reader and AI accessibility (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`).
- **CSS3**: Modern layout techniques (CSS Grid for macro page structures, Flexbox for micro-components, and `clamp()` for fluid typography).
- **JavaScript (ES6)**: DOM interaction and state management for navigation toggles.
- **Constraints**: 100% Vanilla implementation — No CSS or JS frameworks used.

---

## 🎨 Architectural & Design Choices

### 1. Mobile-First Approach
The layout defaults to a single-column architecture optimized for mobile screens. Responsiveness is achieved through `min-width` media queries:
- **Tablet Breakpoint (`768px`)**: Expands single column into dual-column content grids.
- **Desktop Breakpoint (`1024px`)**: Introduces full 2D page layouts with sidebar navigation and main content sections.

### 2. Design System & Palette
- **Mocha Mousse (`#AS856F`)**: Accent color symbolizing stability.
- **Ethereal Blue (`#A0D4E0`)**: Supporting color establishing trust.
- **Moonlit Grey (`#F2F0EA`)**: Neutral background canvas for refined readability.
- **Typography**: Limited to **Inter** (Headlines) and **Roboto** (Body) to maintain visual hierarchy without impacting load performance.

---

## 🚀 How to Run Locally

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/project-1-responsive-layout.git](https://github.com/your-username/project-1-responsive-layout.git)