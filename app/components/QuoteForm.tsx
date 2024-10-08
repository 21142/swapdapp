"use client";

import {
  AFFILIATE_FEE,
  FEE_RECIPIENT,
  POLYGON_CHAIN_ID,
  POLYGON_TOKENS_BY_ADDRESS,
  SEPOLIA_CHAIN_ID,
  SEPOLIA_TOKENS_BY_ADDRESS,
} from "@/lib/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowDown, FileSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import qs from "qs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Address, formatUnits } from "viem";
import {
  BaseError,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ZeroExApiPriceResponse, ZeroExApiQuoteResponse } from "../../types";
import { cn } from "../lib/utils";
import SeparatorVertical from "./SeparatorVertical";
import Spinner from "./Spinner";
import { Button, buttonVariants } from "./ui/Button";
import { CardContent, CardFooter } from "./ui/Card";
import { Label } from "./ui/Label";

interface Props {
  address: Address | undefined;
  priceResponse: ZeroExApiPriceResponse | undefined;
  setPriceResponse: Dispatch<
    SetStateAction<ZeroExApiPriceResponse | undefined>
  >;
  quote: ZeroExApiQuoteResponse | undefined;
  setQuote: (quote: ZeroExApiQuoteResponse) => void;
  setFinalize: Dispatch<SetStateAction<boolean>>;
  chainId: number;
  setBuyAmount: Dispatch<SetStateAction<string>>;
  setSellAmount: Dispatch<SetStateAction<string>>;
}

const QuoteView: React.FC<Props> = ({
  address,
  priceResponse,
  setPriceResponse,
  quote,
  setQuote,
  setFinalize,
  chainId,
  setBuyAmount,
  setSellAmount,
}) => {
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (!priceResponse || !address) return;

    async function fetchQuote() {
      const params = {
        sellToken: priceResponse?.sellTokenAddress,
        buyToken: priceResponse?.buyTokenAddress,
        sellAmount: priceResponse?.sellAmount,
        address,
        feeRecipient: FEE_RECIPIENT,
        buyTokenPercentageFee: AFFILIATE_FEE,
        feeRecipientTradeSurplus: FEE_RECIPIENT,
        chainId,
      };
      const response = await fetch(`/api/quote?${qs.stringify(params)}`);
      const data: ZeroExApiQuoteResponse = await response.json();
      setQuote(data);
    }

    fetchQuote();
  }, [priceResponse, address, chainId, setQuote]);

  const {
    data: hash,
    isPending,
    sendTransaction,
    error,
  } = useSendTransaction();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  if (!quote) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const chainScannerUrl = (chainId: number) =>
    chainId === POLYGON_CHAIN_ID
      ? "https://polygonscan.com"
      : "https://sepolia.etherscan.io";

  const getTokenInfo = (tokenAddress: string | undefined, chainId: number) => {
    const tokensByAddress =
      chainId === POLYGON_CHAIN_ID
        ? POLYGON_TOKENS_BY_ADDRESS
        : SEPOLIA_TOKENS_BY_ADDRESS;

    return tokenAddress
      ? tokensByAddress[tokenAddress.toLowerCase()]
      : undefined;
  };

  const sellTokenInfo = getTokenInfo(priceResponse?.sellTokenAddress, chainId);
  const buyTokenInfo = getTokenInfo(priceResponse?.buyTokenAddress, chainId);

  const formatTokenAmount = (amount: string, decimals: number) =>
    formatUnits(BigInt(amount), decimals);

  return (
    <>
      <CardContent className="p-0 flex flex-col w-full h-full rounded-lg">
        <form className="flex flex-col h-full justify-between w-full">
          <div>
            <div className="flex items-end justify-between w-full">
              <div className="flex flex-col justify-center pt-4 px-4">
                <Label
                  htmlFor="sell"
                  className="text-zinc-700 font-medium text-lg mb-6 ml-1"
                >
                  {isConfirmed ? (
                    <span className="text-green-700 font-bold tracking-wide">
                      Successfully traded
                    </span>
                  ) : (
                    "Trade"
                  )}
                </Label>
              </div>
            </div>

            <div className="flex justify-start text-xl font-semibold items-center pt-0 pb-4 p-2 ml-4">
              {sellTokenInfo && (
                <>
                  <Image
                    alt={sellTokenInfo.symbol}
                    className="h-10 w-10 mr-2 rounded-md"
                    src={sellTokenInfo.logoURI}
                    width={10}
                    height={10}
                  />
                  <span>
                    {formatTokenAmount(
                      quote.sellAmount,
                      sellTokenInfo.decimals
                    )}
                  </span>
                  <div className="ml-2">{sellTokenInfo.symbol}</div>
                </>
              )}
            </div>
          </div>
          <hr className="mt-3 border-zinc-200/50" />
          <div className="relative w-[90%] translate-x-1/2 -translate-y-7">
            <ArrowDown className="h-8 w-8 p-1.5 absolute bg-background rounded-full border-border border-2 text-zinc-800" />
          </div>
          <div>
            <div className="flex flex-col justify-center p-4">
              <Label
                htmlFor="buy-amount"
                className="block text-zinc-700 font-medium text-lg mb-1 ml-1"
              >
                {isConfirmed ? (
                  <span className="text-green-700 font-bold tracking-wide">
                    Successfully received
                  </span>
                ) : (
                  "Receive"
                )}
              </Label>
            </div>
            {}
            <div className="flex justify-start items-center text-xl font-semibold pt-0 pb-4 p-2 ml-4">
              {buyTokenInfo && (
                <>
                  <Image
                    alt={buyTokenInfo.symbol}
                    className="h-10 w-10 mr-2 rounded-md"
                    src={buyTokenInfo.logoURI}
                    width={10}
                    height={10}
                  />
                  <span>
                    {formatTokenAmount(quote.buyAmount, buyTokenInfo.decimals)}
                  </span>
                  <div className="ml-2">{buyTokenInfo.symbol}</div>
                </>
              )}
            </div>
            <div className="text-zinc-400 text-sm px-3 py-2 ml-4">
              {quote.grossBuyAmount &&
                buyTokenInfo &&
                `Fee: ${
                  Number(
                    formatTokenAmount(
                      quote.grossBuyAmount,
                      buyTokenInfo.decimals
                    )
                  ) * AFFILIATE_FEE
                } ${buyTokenInfo.symbol}`}
            </div>
          </div>
          <hr className="border-zinc-200/50" />
        </form>
      </CardContent>
      <CardFooter className="flex py-3 flex-row justify-between">
        {!address ? (
          <div className="w-full flex justify-center">
            <ConnectButton />
          </div>
        ) : chainId !== POLYGON_CHAIN_ID && chainId !== SEPOLIA_CHAIN_ID ? (
          <div className="w-full flex justify-center">
            <Button
              onClick={() =>
                switchChain({
                  chainId: POLYGON_CHAIN_ID,
                })
              }
              className="w-full rounded-full"
            >
              Switch to Polygon network
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-start w-full gap-y-2">
            {!isConfirmed && (
              <Button
                className="font-bold py-2 px-4 rounded-full w-full"
                disabled={isPending || isConfirming || isConfirmed}
                onClick={() => {
                  sendTransaction &&
                    sendTransaction({
                      gas: quote?.gas,
                      to: quote?.to,
                      value: quote?.value,
                      data: quote?.data,
                      gasPrice: quote?.gasPrice,
                    });
                }}
              >
                {isPending ? (
                  <span className="flex items-center gap-x-2">
                    Confirming <Spinner className="h-6 w-6" />
                  </span>
                ) : isConfirming && !isConfirmed && !error && !receiptError ? (
                  <span className="flex items-center gap-x-2 text-center">
                    Waiting for confirmation <Spinner className="w-6 h-6" />
                  </span>
                ) : (
                  "Place order"
                )}
              </Button>
            )}

            {isConfirmed && (
              <div className="flex flex-col w-fit -pt-2 text-zinc-700 gap-y-2 justify-start">
                <div
                  className="flex
                 gap-x-4 items-center"
                >
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setFinalize(false);
                      setPriceResponse(undefined);
                      setBuyAmount("");
                      setSellAmount("");
                    }}
                    className="rounded-full border-none p-3 bg-zinc-300/20 flex items-center gap-x-2 hover:bg-zinc-400/20 transition-all"
                  >
                    Start a new trade
                  </Button>
                  <SeparatorVertical />
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "rounded-full border-none p-3 bg-zinc-300/20 flex items-center gap-x-2 hover:bg-zinc-400/20 transition-all"
                    )}
                    href={`${chainScannerUrl(chainId)}/tx/${hash}`}
                    target="_blank"
                  >
                    Check transaction details
                    <FileSearch className="h-4 w-4 text-foreground hover:cursor-pointer hover:text-zinc-900" />
                  </Link>
                </div>
              </div>
            )}

            {(error || receiptError) && (
              <span className="text-red-500 p-1 pt-2 text-sm w-full break-words">
                Transaction Failed! [{(error || receiptError)?.name}]{" "}
                {(error as BaseError)?.shortMessage ||
                  (error || receiptError)?.message}
              </span>
            )}

            {(error || receiptError) && (
              <div className="flex flex-col pt-1 w-fit text-zinc-700 gap-y-2 justify-start">
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-full p-3 bg-zinc-300/20 flex items-center gap-x-2 hover:bg-zinc-400/20 transition-all"
                  )}
                  href={`${chainScannerUrl(chainId)}/tx/${hash}`}
                  target="_blank"
                >
                  Check transaction details
                  <FileSearch className="h-4 w-4 text-foreground hover:cursor-pointer hover:text-zinc-900" />
                </Link>
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </>
  );
};

export default QuoteView;
