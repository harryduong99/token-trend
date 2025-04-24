# Crypto Trend Visualization

A modern React component for visualizing Bitcoin price trends using data from the Binance API.

## Overview

This project showcases a reusable React component that displays Bitcoin price data with a compact visualization. The `BTCTrendComponent` presents current price and trend information in a clean, accessible interface.

## Features

- Bitcoin price data from Binance API  
- 24-hour price trend visualization with sparkline chart  
- Percentage change indicator with color coding (green for positive, red for negative)  
- Responsive design that adapts to container width  
- Accessible UI with ARIA labels and keyboard navigation  
- Loading states with animated skeleton UI  
- Error handling with clear visual feedback  

## Component Usage

```tsx
<BTCTrendComponent pair="BTCUSDT" />
```

## Project Structure

The project follows a clean architecture pattern:

```
src/
├── modules/
│   └── trend/
│       ├── components/
│       │   └── btc-trend.tsx    # Main component
│       ├── types.ts             # Type definitions
│       ├── services/
│       │   └── trend-service.tsx # API service layer
│       └── queries/
│           └── token-trend.tsx  # React Query hooks
└── app/
    ├── globals.css              # Global styles
    ├── providers.tsx            # Includes React Query provider setup
    └── page.tsx                 # Demo page
```

## Technical Implementation

- TypeScript for type safety  
- React and Next.js for UI framework  
- TanStack Query for data fetching and state management  
- Tailwind CSS for styling  
- SVG-based sparkline visualization  
- Accessible design with ARIA attributes  

## Development

This project uses pnpm as the package manager of choice:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Demo

Error state:

https://github.com/user-attachments/assets/4aebaada-044b-4051-9863-4aabd0bc96fb




