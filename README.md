# swapdApp - decentralized exchange (DEX)

This project is a simple decentralized exchange (DEX) built with TypeScript, Next.js, Wagmi, Viem, Visx, and integrated with the 0x Swap API (v1) and CoinGecko API. It provides users with a seamless trading experience for various cryptocurrencies.

## Demo

Check out the live demo at: [swapdapp.vercel.app](https://swapdapp.vercel.app)

## Features

- 🔄 **Decentralized Trading**: Facilitate cryptocurrencies swap transactions on Polygon and Sepolia.
- ⚡ **Best prices**: Leverage the 0x Swap API for quick and efficient token swaps.
- 📈 **Price Tracking**: Utilize the CoinGecko API to fetch real-time cryptocurrency prices.
- 💹 **Interactive Charts**: Create visual representations of price trends and market data using Visx.
- 🌐 **Web3 Integration**: Use Wagmi for smooth wallet connections and user interactions.
- 🛠️ **TypeScript & Next.js**: Enjoy a type-safe development experience with a powerful React framework.
- 🎨 **Modern UI**: TailwindCSS for clean, minimalistic styling.

## How It Works

1. **Connect Wallet**: Users can connect their cryptocurrency wallets using supported providers.
2. **Token Swapping**: Users can select tokens to swap, view current prices in one of the available periods, and execute trades/swap transactions through the DEX interface.
3. **Price and Quote**: Users can view the current price of the selected token pair and then have the option to set the allowance and approve the quoted order for the swap transaction.
4. **Real-Time Data**: Prices and charts update in real-time, providing users with the latest market information.

## Getting Started

This is a [RainbowKit](https://rainbowkit.com) + [wagmi](https://wagmi.sh) + [Next.js](https://nextjs.org/) project bootstrapped with [`create-rainbowkit`](/packages/create-rainbowkit).

To get started with the running the app locally on your machine, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/21142/swapdapp.git
   cd swapdapp
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add the following environment variables:

   ```bash
   ZEROEX_API_KEY=YOUR_0X_API_KEY
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID

   NEXT_PUBLIC_ENABLE_TESTNETS=true // Optional: Enable testnets
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.
