import { Address } from "viem";

export const ONE_HOUR_IN_DAYS = 0.04166666666;

interface Token {
   name: string;
   address: Address;
   symbol: string;
   decimals: number;
   chainId: number;
   logoURI: string;
   coingeckoSymbol?: string;
}

export const POLYGON_TOKENS: Token[] = [
   {
      chainId: 137,
      name: "Wrapped Matic",
      symbol: "WMATIC",
      decimals: 18,
      address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
      logoURI:
         "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/matic.svg",
   },
   {
      chainId: 137,
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      logoURI:
         "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/weth.svg",
   },
   {
      chainId: 137,
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      logoURI:
         "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
   },
   // {
   //    chainId: 137,
   //    name: "USDT",
   //    symbol: "USDT",
   //    decimals: 6,
   //    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
   //    logoURI:
   //       "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdt.svg",
   // },
   {
      chainId: 137,
      name: "Dai - PoS",
      symbol: "DAI",
      decimals: 18,
      address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
      logoURI:
         "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/dai.svg",
   },
];

export const POLYGON_TOKENS_BY_SYMBOL: Record<string, Token> = {
   wmatic: {
      chainId: 137,
      name: "Wrapped Matic",
      symbol: "WMATIC",
      decimals: 18,
      address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
      logoURI:
         "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/matic.svg",
      coingeckoSymbol: "wmatic",
   },
   weth: {
      chainId: 137,
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      logoURI:
         "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/weth.svg",
      coingeckoSymbol: "weth",
   },
   usdc: {
      chainId: 137,
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      logoURI:
         "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
      coingeckoSymbol: "usd",
   },
   // usdt: {
   //    chainId: 137,
   //    name: "USDT",
   //    symbol: "USDT",
   //    decimals: 6,
   //    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
   //    logoURI:
   //       "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdt.svg",
   //    coingeckoSymbol: "usdt",
   // },
   dai: {
      chainId: 137,
      name: "Dai - PoS",
      symbol: "DAI",
      decimals: 18,
      address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
      logoURI:
         "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/dai.svg",
      coingeckoSymbol: "dai"
   },
};

export const POLYGON_TOKENS_BY_ADDRESS: Record<string, Token> = {
   "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270": {
      chainId: 137,
      name: "Wrapped Matic",
      symbol: "WMATIC",
      decimals: 18,
      address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
      logoURI:
         "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/matic.svg",
   },
   "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359": {
      chainId: 137,
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      logoURI:
         "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
   },
   "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063": {
      chainId: 137,
      name: "Dai - PoS",
      symbol: "DAI",
      decimals: 18,
      address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
      logoURI:
         "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/dai.svg",
   },
};

