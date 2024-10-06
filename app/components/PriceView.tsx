"use client";

import PriceChart from "@/components/PriceChart";
import SeparatorVertical from "@/components/SeparatorVertical";
import { Button, buttonVariants } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  periods,
  type PeriodsType,
  periodWordings,
  type Token,
} from "@/lib/constants";
import { cn, getTokensBySymbolByChain } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Copy, FileSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { parseUnits } from "viem";
import { useAccount, useBalance, useSwitchChain } from "wagmi";
import PeriodButtons from "./PeriodButtons";
import SwapForm from "./SwapForm";

const PriceView = () => {
  const [period, setPeriod] = useState<PeriodsType>(periods.ONE_DAY);
  const [sellAmount, setSellAmount] = useState<string>("");
  const [sellToken, setSellToken] = useState<string>("weth");
  const [sellTokenData, setSellTokenData] = useState<Token | undefined>();
  const [buyAmount, setBuyAmount] = useState<string>("");
  const [buyToken, setBuyToken] = useState<string>("usdc");
  const [buyTokenData, setBuyTokenData] = useState<Token | undefined>();
  const [price, setPrice] = useState<string>();
  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [chainId, setChainId] = useState<number>(chain?.id || 137);

  const { data: balance } = useBalance({
    address: address,
  });

  const insufficientBalance =
    balance && sellAmount ? parseUnits(sellAmount, 18) > balance.value : true;

  useEffect(() => {
    if (chain?.id) {
      setChainId(chain.id);
    }

    if (chain?.id === 11155111) {
      setBuyToken("link");
    } else if (chain?.id === 137) {
      setBuyToken("usdc");
    }
  }, [chain]);

  useEffect(() => {
    const tokens = getTokensBySymbolByChain(chainId);
    setSellTokenData(tokens[sellToken]);
    setBuyTokenData(tokens[buyToken]);
  }, [chain?.id, sellToken, buyToken, chainId]);

  const swapTokenDirection = () => {
    setSellToken(buyToken);
    setBuyToken(sellToken);
    setBuyAmount("");
    setPrice("");
  };

  const copyAddressToClipboard = () => {
    if (sellTokenData?.address) {
      navigator.clipboard.writeText(sellTokenData.address);
    }
  };

  const getPeriodWording =
    periodWordings[
      Object.keys(periods).find(
        (key) => periods[key as keyof typeof periods] === period
      ) as keyof typeof periods
    ];

  // if (!sellTokenData || !buyTokenData) {
  //   return (
  //     <div className="w-full h-[50vh] flex items-center justify-center">
  //       <Spinner />
  //     </div>
  //   );
  // }

  return (
    <div className="py-6 px-4">
      <div className="flex flex-col lg:flex-row items-start pl-5 lg:items-center justify-between">
        <div className="text-3xl pb-4 flex items-end gap-x-2 font-semibold text-zinc-800">
          <Image
            width={36}
            height={36}
            src={sellTokenData?.logoURI as string}
            alt={`${sellTokenData?.name}'s' icon`}
          />{" "}
          <span className="min-w-fit">{sellTokenData?.name}</span>
          <span className="text-zinc-500 text-lg mt-1 ml-2">
            {sellTokenData?.symbol}
          </span>
          {/* <ArrowRightLeft
            onClick={swapTokenDirection}
            className="h-6 w-6 text-zinc-700 hover:cursor-pointer hover:text-zinc-900"
          />
          <span className="flex items-center gap-2">
            <Image
              width={36}
              height={36}
              src={buyTokenData.logoURI}
              alt={`${buyTokenData.name}'s' icon`}
            />{" "}
            {buyTokenData.name}
          </span> */}
        </div>
        <div className="flex flex-col items-start sm:flex-row sm:items-center justify-center gap-2 sm:gap-4">
          <Button
            onClick={swapTokenDirection}
            variant="outline"
            className="rounded-3xl bg-zinc-300/20 hover:bg-zinc-400/20 flex gap-x-1.5 transition-all"
          >
            <Image
              width={16}
              height={16}
              src={buyTokenData?.logoURI as string}
              alt={`${buyTokenData?.name}'s' icon`}
            />
            Switch to {buyTokenData?.symbol}
          </Button>
          <SeparatorVertical />
          <div className="flex items-center gap-1 pr-4">
            {sellTokenData?.address && (
              <Button
                onClick={copyAddressToClipboard}
                variant="outline"
                className="rounded-3xl flex items-center bg-zinc-300/20 hover:bg-zinc-400/20 text-muted-foreground gap-x-1.5 transition-all"
              >
                Address:
                <span className="text-foreground">
                  {sellTokenData?.address.slice(0, 5)}...
                  {sellTokenData?.address.slice(-3)}
                </span>
                <Copy className="h-4 w-4" />
              </Button>
            )}
            <Link
              href={`https://polygonscan.com/token/${sellTokenData?.address}`}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-full p-3 bg-zinc-300/20 hover:bg-zinc-400/20 transition-all"
              )}
              target="_blank"
            >
              <FileSearch className="h-4 w-4 text-foreground hover:cursor-pointer hover:text-zinc-900" />
            </Link>
          </div>
        </div>
      </div>
      <div className="p-2 grid grid-cols-1 md:grid-cols-5 gap-y-4 md:gap-4">
        <Card className="col-span-3 pb-0 overflow-hidden h-fit">
          <CardHeader className="flex pt-4 flex-col sm:flex-row items-start sm:items-center justify-between">
            <CardTitle className="text-3xl sm:pl-3 text-zinc-800 font-normal gap-y-1.5 flex flex-col items-start justify-start">
              <span className="pt-4">
                {price ? (
                  `$${price}`
                ) : (
                  <Skeleton className="w-[150px] h-[35px] rounded-3xl" />
                )}
              </span>
              <div className="flex text-sm gap-x-2">
                {/* <span className="text-green-500">+1.13%</span>{" "} */}
                <span className="text-muted-foreground">
                  {getPeriodWording}
                </span>
              </div>
            </CardTitle>
            <PeriodButtons period={period} setPeriod={setPeriod} />
          </CardHeader>
          <CardContent className="p-0 relative h-[346px]">
            <PriceChart
              sellToken={sellTokenData?.coingeckoApiId as string}
              buyToken={buyTokenData?.coingeckoApiId as string}
              period={period}
              setPrice={setPrice}
            />
          </CardContent>
        </Card>
        <Card className="col-span-2 flex flex-col">
          <CardHeader className="flex pb-4 border-b border-border/50 flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium text-zinc-800">
              Market
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col w-full h-full rounded-lg">
            <SwapForm
              address={address}
              chainId={chainId}
              sellToken={sellToken}
              setSellToken={setSellToken}
              setSellTokenData={setSellTokenData}
              sellAmount={sellAmount}
              setSellAmount={setSellAmount}
              sellTokenData={sellTokenData}
              buyToken={buyToken}
              setBuyToken={setBuyToken}
              setBuyTokenData={setBuyTokenData}
              buyAmount={buyAmount}
              setBuyAmount={setBuyAmount}
              buyTokenData={buyTokenData}
              balance={balance}
              setPrice={setPrice}
              swapTokenDirection={swapTokenDirection}
            />
          </CardContent>
          <CardFooter className="flex py-4 flex-row justify-between">
            {!address ? (
              <div className="w-full flex justify-center">
                <ConnectButton />
              </div>
            ) : chain?.id !== 137 ? (
              <div className="w-full flex justify-center">
                <Button
                  onClick={() =>
                    switchChain({
                      chainId: 137,
                    })
                  }
                  className="w-full rounded-full"
                >
                  Switch to Polygon network
                </Button>
              </div>
            ) : (
              <Button
                className="w-full rounded-full"
                size="lg"
                disabled={insufficientBalance}
              >
                {insufficientBalance ? "Insufficient balance" : "Review order"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PriceView;
