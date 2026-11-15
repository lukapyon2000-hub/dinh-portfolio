# Nguyễn Đình Đình — Interactive Web Portfolio

Interactive web edition of Nguyễn Đình Đình's **Techcombank Campus Ambassador 2026** portfolio (University of Law HCMC — Communication, Partnership & Event Projects), engineered to preserve **100% of the original PDF design, typography, collage layout, and image positions** while adding modern web motion, interactive UX/UI, and cursor-following link previews.

## Features

- **100% Design & Layout Preservation**: High-DPI WebP section slices (`2049px` wide) extracted seamlessly from the original portfolio PDF so every portrait, Polaroid frame, mockup, and typographic lockup remains in its exact original coordinates.
- **Cursor-Following Link Preview (`CursorLinkTooltip`)**: Hovering over any interactive card, phone/email badge, event photo, sponsor tag, or action button reveals a spring-physics floating card beside the cursor showing the exact destination link and action context.
- **Modern Scroll & Marquee Motion**: Powered by `motion/react` with GPU-composited entrance transitions, active navigation underline tracking, scroll reading progress indicator, and animated marquee ticker ribbons (`DINH DINH PORTFOLIO | COMMUNICATION | PARTNERSHIP | EVENTS`).
- **Interactive Case Studies & 3-Minute Crisis Simulator**:
  - Click any project (`Hội Trại Truyền Thống`, `Gấm Vóc Non Sông`, `NCKH Hợp đồng điện tử`, `Body Language For Lawyers`) or sponsor (`YEAH1`, `HADA LABO`, `AZ`, `NOVOTANE`) to inspect structured deliverables and outcomes.
  - Click **Play scenario** or any **Scenario** bubble in Project 03 to test the interactive 3-minute Techcombank crisis simulation (Business, HR, Legal).
  - Click **Hiện vùng link** in the bottom-right corner at any time to highlight all interactive hotspots across the portfolio.

## Repository Structure

```text
├── .github/workflows/deploy.yml  # Auto-deploy to GitHub Pages on push to main
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts                # Configured with base: './' for GitHub Pages
├── public/
│   ├── assets/aistudio/          # Original portfolio PDF
│   └── portfolio/                # Seamless high-DPI WebP section slices (s01..s09)
└── src/
    ├── App.tsx                   # Main portfolio stage, navigation, toast & modal orchestration
    ├── index.css                 # Global styles, font tokens & marquee keyframes
    ├── main.tsx
    ├── types/portfolio.ts        # TypeScript interfaces for sections, hotspots & scenarios
    ├── data/portfolioData.ts     # Precision hotspot coordinates, case studies & scenarios
    └── components/
        ├── Navbar.tsx            # 3-zone sticky editorial header & scroll progress bar
        ├── CursorLinkTooltip.tsx # Spring-physics floating link preview beside mouse cursor
        ├── MarqueeRibbon.tsx     # Animated horizontal portfolio ticker ribbon
        ├── PortfolioSection.tsx  # Section renderer with interactive hotspot overlay
        └── DetailModal.tsx       # Case study viewer, 3-min crisis simulator & contact form
```

## Push to GitHub & Deploy Free on GitHub Pages

```bash
git init
git add .
git commit -m "feat: interactive portfolio web edition"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Then in your GitHub repository:
1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. The included `.github/workflows/deploy.yml` will automatically build and publish your portfolio live.

## Mở trực tiếp trên máy tính (Không cần cài Node.js)

Sau khi giải nén, chỉ cần **nhấn đúp chuột vào `index.html`** (hoặc mở `public/mo-truc-tiep.html`). Hệ thống sẽ tự động mở bản đóng gói độc lập hoạt động đầy đủ hiệu ứng motion, trỏ chuột hiện link và mô phỏng 3 phút ngay trên trình duyệt.

## Local Development (Dành cho lập trình viên)

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```
