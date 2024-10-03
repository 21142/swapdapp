"use client";

import PriceChart from "./components/PriceChart";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/Card";
import { Button, buttonVariants } from "./components/ui/Button";
import { useEffect, useState } from "react";
import { useAccount, useBalance, useSwitchChain } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { Input } from "./components/ui/Input";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Label } from "./components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/Select";
import { ArrowRightLeft, ArrowUpDown, Copy, FileSearch } from "lucide-react";
import qs from "qs";
import {
  ONE_HOUR_IN_DAYS,
  POLYGON_TOKENS,
  POLYGON_TOKENS_BY_SYMBOL,
} from "./lib/constants";
import Image from "next/image";
import Link from "next/link";
import { cn } from "./lib/utils";
import SeparatorVertical from "./components/SeparatorVertical";
import { Skeleton } from "./components/ui/Skeleton";

export default function Page() {
  const [period, setPeriod] = useState<
    typeof ONE_HOUR_IN_DAYS | 1 | 7 | 31 | 365
  >(1);
  const [price, setPrice] = useState<string>();
  const [error, setError] = useState([]);
  const [sellAmount, setSellAmount] = useState<string>("");
  const [sellToken, setSellToken] = useState<string>("wmatic");
  const [buyAmount, setBuyAmount] = useState<string>("");
  const [buyToken, setBuyToken] = useState<string>("usdc");
  const { address, chain } = useAccount();

  const { switchChain } = useSwitchChain();

  const chainId = chain?.id || 137;

  const tokensByChain = (chainId: number) => {
    if (chainId === 137) {
      return POLYGON_TOKENS_BY_SYMBOL;
    }
    return POLYGON_TOKENS_BY_SYMBOL;
  };

  const sellTokenData = tokensByChain(chainId)[sellToken];
  const buyTokenData = tokensByChain(chainId)[buyToken];

  const sellTokenDecimals = sellTokenData?.decimals;
  const buyTokenDecimals = buyTokenData?.decimals;

  const parsedSellAmount = sellAmount
    ? parseUnits(sellAmount, sellTokenDecimals).toString()
    : undefined;

  const parsedBuyAmount = buyAmount
    ? parseUnits(buyAmount, buyTokenDecimals).toString()
    : undefined;

  useEffect(() => {
    const params = {
      sellToken: sellTokenData?.address,
      buyToken: buyTokenData?.address,
      sellAmount: parsedSellAmount,
      // buyAmount: parsedBuyAmount,
      address,
      chainId,
    };

    async function main() {
      const response = await fetch(`/api/price?${qs.stringify(params)}`);
      const data = await response.json();

      if (data?.validationErrors?.length > 0) {
        setError(data.validationErrors);
      } else {
        setError([]);
      }
      if (data.buyAmount) {
        setBuyAmount(formatUnits(data.buyAmount, buyTokenDecimals));
        // setPrice(data);
      }
    }

    if (sellAmount !== "") {
      main();
    }
  }, [
    sellToken,
    buyToken,
    sellAmount,
    buyAmount,
    address,
    chainId,
    setPrice,
    sellTokenData,
    buyTokenData,
  ]);

  const { data: balance } = useBalance({
    address: address,
  });

  const insufficientBalance =
    balance && sellAmount ? parseUnits(sellAmount, 18) > balance.value : true;

  const handleSellTokenChange = (selectedToken: string) => {
    if (selectedToken === buyToken) {
      swapTokenDirection();
    } else {
      setSellToken(selectedToken);
    }
  };

  const handleBuyTokenChange = (selectedToken: string) => {
    if (selectedToken === sellToken) {
      swapTokenDirection();
    } else {
      setBuyToken(selectedToken);
    }
  };

  const swapTokenDirection = () => {
    setSellToken(buyToken);
    setBuyToken(sellToken);
  };

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(sellTokenData.address);
  };

  const getWordingBasedOnPeriod = (period: number) => {
    if (period === ONE_HOUR_IN_DAYS) {
      return "Last Hour";
    } else if (period === 1) {
      return "Last 24 hours";
    } else if (period === 7) {
      return "Last Week";
    } else if (period === 31) {
      return "Last Month";
    } else if (period === 365) {
      return "Last Year";
    }
  };

  return (
    <div className="py-6 px-4">
      <div className="flex flex-col md:flex-row items-start pl-5 md:items-center justify-between">
        <p className="text-3xl pb-4 flex items-center gap-x-2 font-semibold text-zinc-800">
          <span className="flex items-center gap-2">
            <Image
              width={36}
              height={36}
              src={sellTokenData.logoURI}
              alt={`${sellTokenData.name}'s' icon`}
            />{" "}
            {sellTokenData.name}
          </span>
          <ArrowRightLeft
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
          </span>
        </p>
        <div className="flex flex-col items-start md:flex-row md:items-center justify-center gap-2 md:gap-4">
          <Button
            onClick={swapTokenDirection}
            variant="outline"
            className="rounded-3xl bg-zinc-300/20 hover:bg-zinc-400/20 flex gap-x-1.5 transition-all"
          >
            <Image
              width={16}
              height={16}
              src={buyTokenData.logoURI}
              alt={`${buyTokenData.name}'s' icon`}
            />
            Switch to {buyTokenData.symbol}
          </Button>
          <SeparatorVertical />
          <div className="flex items-center gap-1 pr-4">
            {sellTokenData.address && (
              <Button
                onClick={copyAddressToClipboard}
                variant="outline"
                className="rounded-3xl flex items-center bg-zinc-300/20 hover:bg-zinc-400/20 text-muted-foreground gap-x-1.5 transition-all"
              >
                Address:
                <span className="text-foreground">
                  {sellTokenData.address.slice(0, 5)}...
                  {sellTokenData.address.slice(-3)}
                </span>
                <Copy className="h-4 w-4" />
              </Button>
            )}
            <Link
              href={`https://polygonscan.com/token/${sellTokenData.address}`}
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
              <p className="pt-4">
                {price ? (
                  `$${price}`
                ) : (
                  <Skeleton className="w-[150px] h-[35px] rounded-3xl" />
                )}
              </p>
              <div className="flex text-sm gap-x-2">
                <span className="text-green-500">+1.13%</span>{" "}
                <span className="text-muted-foreground">
                  {getWordingBasedOnPeriod(period)}
                </span>
              </div>
            </CardTitle>
            <div className="flex text-zinc-600 gap-1 items-center">
              <Button
                variant={`${period === ONE_HOUR_IN_DAYS ? "toned" : "ghost"}`}
                onClick={() => setPeriod(ONE_HOUR_IN_DAYS)}
              >
                1H
              </Button>
              <Button
                variant={`${period === 1 ? "toned" : "ghost"}`}
                onClick={() => setPeriod(1)}
              >
                1D
              </Button>
              <Button
                variant={`${period === 7 ? "toned" : "ghost"}`}
                onClick={() => setPeriod(7)}
              >
                1W
              </Button>
              <Button
                variant={`${period === 31 ? "toned" : "ghost"}`}
                onClick={() => setPeriod(31)}
              >
                1M
              </Button>
              <Button
                variant={`${period === 365 ? "toned" : "ghost"}`}
                onClick={() => setPeriod(365)}
              >
                1Y
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 relative h-[346px]">
            <PriceChart
              sellToken={sellTokenData?.coingeckoSymbol as string}
              buyToken={buyTokenData?.coingeckoSymbol as string}
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
            <form className="flex flex-col h-full justify-between w-full">
              <div className="h-full">
                <div className="flex items-end justify-between w-full">
                  <div className="flex flex-col justify-center pt-4 px-4">
                    <Label
                      htmlFor="sell"
                      className="text-zinc-700 font-medium mb-4 ml-1"
                    >
                      Sell
                    </Label>
                    <Select
                      value={sellToken}
                      onValueChange={handleSellTokenChange}
                    >
                      <SelectTrigger className="w-fit rounded-3xl bg-muted/50 hover:border-zinc-300 hover:bg-muted transition-all">
                        <SelectValue placeholder={sellToken} />
                      </SelectTrigger>
                      <SelectContent className="rounded-3xl">
                        {POLYGON_TOKENS.map((token) => {
                          return (
                            <SelectItem
                              key={token.address}
                              className="rounded-3xl"
                              value={token.symbol.toLowerCase()}
                            >
                              <div className="flex items-center gap-x-2 w-full mr-2">
                                <Image
                                  width={24}
                                  height={24}
                                  src={token.logoURI}
                                  alt={`${token.name}'s' icon`}
                                />
                                {token.symbol}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col justify-center gap-y-4 items-end">
                    <span className="text-muted-foreground text-xs mr-6">
                      Balance:{" "}
                      {balance?.formatted! == "0" ? "-" : balance?.formatted!}
                    </span>
                    <div className="flex mr-2">
                      {sellAmount && (
                        <Button
                          className="mx-1 rounded-full text-foreground bg-zinc-300/20 hover:bg-zinc-400/20 flex items-center gap-x-1.5 transition-all"
                          onClick={() => {
                            setSellAmount("");
                            setBuyAmount("");
                          }}
                        >
                          Clear
                        </Button>
                      )}
                      <Button
                        className="mx-1 rounded-full text-foreground bg-zinc-300/20 hover:bg-zinc-400/20 flex items-center gap-x-1.5 transition-all"
                        onClick={() => {
                          setSellAmount(balance?.formatted!);
                        }}
                        disabled={balance?.formatted == "0"}
                      >
                        50%
                      </Button>
                      <Button
                        className="mx-1 rounded-full text-foreground bg-zinc-300/20 hover:bg-zinc-400/20 flex items-center gap-x-1.5 transition-all"
                        onClick={() => {
                          setSellAmount(balance?.formatted!);
                        }}
                        disabled={balance?.formatted == "0"}
                      >
                        Max
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center rounded overflow-hidden pt-0 pb-4 p-2">
                  <Input
                    id="sell-amount"
                    type="number"
                    value={sellAmount}
                    placeholder="0.0"
                    className="w-full p-3 mt-4 text-3xl border-none placeholder:text-zinc-400 ring-0 font-medium text-zinc-600"
                    onChange={(e) => {
                      setSellAmount(e.target.value);
                    }}
                  />
                </div>
              </div>
              <hr className="border-zinc-200/50" />
              <div className="relative w-[95%] translate-x-1/2 -translate-y-4">
                <ArrowUpDown
                  onClick={swapTokenDirection}
                  className="h-8 w-8 p-1.5 absolute bg-background rounded-full border-border border-2 text-zinc-800 hover:cursor-pointer hover:border-zinc-300 hover:bg-muted transition-all"
                />
              </div>
              <div className="h-full">
                <div className="flex flex-col justify-center p-4">
                  <Label
                    htmlFor="buy-amount"
                    className="block text-zinc-700 font-medium mb-4 ml-1"
                  >
                    Receive
                  </Label>
                  <Select value={buyToken} onValueChange={handleBuyTokenChange}>
                    <SelectTrigger className="w-fit bg-muted/50 rounded-3xl hover:border-zinc-300 hover:bg-muted transition-all">
                      <SelectValue placeholder={buyToken} />
                    </SelectTrigger>
                    <SelectContent className="rounded-3xl">
                      {POLYGON_TOKENS.map((token) => {
                        return (
                          <SelectItem
                            key={token.address}
                            className="rounded-3xl"
                            value={token.symbol.toLowerCase()}
                          >
                            <div className="flex items-center fo gap-x-2 w-full mr-2">
                              <Image
                                width={24}
                                height={24}
                                src={token.logoURI}
                                alt={`${token.name}'s' icon`}
                              />
                              {token.symbol}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex break-normal justify-between items-center rounded overflow-hidden pt-0 pb-4 p-2">
                  <Input
                    id="buy-amount"
                    type="number"
                    placeholder="0.0"
                    className="w-full p-3 border-none ring-0 text-3xl font-medium placeholder:text-zinc-400 text-zinc-600 cursor-not-allowed"
                    defaultValue={buyAmount}
                  />
                </div>
              </div>
              <hr className="border-zinc-200/50" />
              {error.length > 0 &&
                error.map(({ field, code, reason, description }, index) => (
                  <div key={index} className="text-red-500 text-sm">
                    [{code}] {reason} - {description}
                  </div>
                ))}
            </form>
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
}
