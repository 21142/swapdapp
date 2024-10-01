"use client";

import PriceChart from "./components/PriceChart";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/Card";
import { Button } from "./components/ui/Button";
import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { parseUnits } from "viem";
import { Input } from "./components/ui/Input";

export default function Page() {
  const [period, setPeriod] = useState<1 | 7 | 31 | 365>(1);
  const [sellAmount, setSellAmount] = useState<string>("");
  const [buyAmount, setBuyAmount] = useState<string>("");
  const { address } = useAccount();
  const { data } = useBalance({
    address: address,
  });

  const insufficientBalance =
    data && sellAmount ? parseUnits(sellAmount, 18) > data.value : true;

  return (
    <main className="py-6 px-4">
      <div className="p-2 grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-3xl text-zinc-800">BTC / USD</CardTitle>
            <div className="flex text-zinc-600 gap-2 items-center">
              <Button
                variant={`${period === 1 ? "outline" : "ghost"}`}
                onClick={() => setPeriod(1)}
              >
                1D
              </Button>
              <Button
                variant={`${period === 7 ? "outline" : "ghost"}`}
                onClick={() => setPeriod(7)}
              >
                1W
              </Button>
              <Button
                variant={`${period === 31 ? "outline" : "ghost"}`}
                onClick={() => setPeriod(31)}
              >
                1M
              </Button>
              <Button
                variant={`${period === 365 ? "outline" : "ghost"}`}
                onClick={() => setPeriod(365)}
              >
                1Y
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <PriceChart period={period} />
          </CardContent>
        </Card>
        <Card className="col-span-2 flex flex-col">
          <CardHeader className="flex mt-2 border-b border-border/50 flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium text-zinc-800">
              Market
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-full">
            <div className="w-full h-full rounded-lg">
              <form className="flex flex-col h-full justify-between w-full">
                <div className="mb-6">
                  <div className="flex items-center p-4">
                    <label
                      htmlFor="sell"
                      className="text-zinc-700 font-medium mb-2 mr-2"
                    >
                      Sell BTC
                    </label>
                  </div>

                  <div className="flex justify-between items-center rounded overflow-hidden p-4">
                    <Input
                      id="sell-amount"
                      type="number"
                      value={sellAmount}
                      placeholder="Amount"
                      className="w-full p-3 text-2xl border-none ring-0 font-medium text-zinc-600"
                      onChange={(e) => {
                        setSellAmount(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <hr className="my-6 border-zinc-200/50" />

                <div className="mb-6">
                  <div className="flex items-center p-4">
                    <label
                      htmlFor="buy-amount"
                      className="block text-zinc-700 font-medium mb-2 mr-2"
                    >
                      Buy USDT
                    </label>
                  </div>
                  <div className="flex justify-between items-center rounded overflow-hidden p-4">
                    <Input
                      id="buy-amount"
                      type="number"
                      placeholder="Amount"
                      className="w-full p-3 border-none ring-0 text-2xl font-medium text-zinc-600 cursor-not-allowed"
                      value={buyAmount}
                      readOnly
                    />
                  </div>
                </div>
                <hr className="my-6 border-zinc-200/50" />
              </form>
            </div>
          </CardContent>
          <CardFooter className="flex pt-6 flex-row justify-between">
            <Button
              className="w-full rounded-full"
              size="lg"
              disabled={insufficientBalance}
            >
              {insufficientBalance ? "Insufficient balance" : "Review order"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
