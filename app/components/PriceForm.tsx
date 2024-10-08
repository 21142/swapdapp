import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { AFFILIATE_FEE, FEE_RECIPIENT, type Token } from "@/lib/constants";
import { getTokensBySymbolByChain } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import qs from "qs";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { type Address, formatUnits, parseUnits } from "viem";
import { ZeroExApiPriceResponse } from "../../types";
import TokenSelector from "./TokenSelector";

interface PriceFormProps {
  chainId: number;
  sellToken: string;
  setSellToken: Dispatch<SetStateAction<string>>;
  setSellTokenData: Dispatch<SetStateAction<Token | undefined>>;
  sellAmount: string;
  setSellAmount: Dispatch<SetStateAction<string>>;
  sellTokenData: Token | undefined;
  buyToken: string;
  setBuyToken: Dispatch<SetStateAction<string>>;
  setBuyTokenData: Dispatch<SetStateAction<Token | undefined>>;
  buyAmount: string;
  setBuyAmount: Dispatch<SetStateAction<string>>;
  buyTokenData: Token | undefined;
  balance:
    | {
        decimals: number;
        formatted: string;
        symbol: string;
        value: bigint;
      }
    | undefined;
  setPrice: Dispatch<SetStateAction<string | undefined>>;
  swapTokenDirection: () => void;
  takerAddress: Address | undefined;
  setPriceResponse?: (price: any) => void;
}

const PriceForm: React.FC<PriceFormProps> = ({
  chainId,
  sellToken,
  setSellToken,
  setSellTokenData,
  sellAmount,
  setSellAmount,
  sellTokenData,
  buyToken,
  setBuyToken,
  setBuyTokenData,
  buyAmount,
  setBuyAmount,
  buyTokenData,
  balance,
  setPrice,
  swapTokenDirection,
  takerAddress,
  setPriceResponse,
}) => {
  const [error, setError] = useState([]);

  const sellTokenDecimals = sellTokenData?.decimals ?? 18;
  const buyTokenDecimals = buyTokenData?.decimals ?? 18;

  const parsedSellAmount = sellAmount
    ? parseUnits(sellAmount, sellTokenDecimals).toString()
    : undefined;

  const handleSellTokenChange = (selectedToken: string) => {
    setPrice(undefined);
    if (selectedToken === buyToken) {
      swapTokenDirection();
    } else {
      setSellToken(selectedToken);
      setSellTokenData(getTokensBySymbolByChain(chainId)[buyToken]);
    }
  };

  const handleBuyTokenChange = (selectedToken: string) => {
    setPrice(undefined);
    if (selectedToken === sellToken) {
      swapTokenDirection();
    } else {
      setBuyToken(selectedToken);
      setBuyTokenData(getTokensBySymbolByChain(chainId)[sellToken]);
    }
  };

  const handleSetSellAmountToHalfBalance = () => {
    if (balance) {
      const amount = (BigInt(balance.value) * BigInt(50)) / BigInt(100);
      const formattedAmount = formatUnits(amount, balance.decimals);
      setSellAmount(formattedAmount);
    }
  };

  useEffect(() => {
    const params = {
      sellToken: sellTokenData?.address,
      buyToken: buyTokenData?.address,
      sellAmount: parsedSellAmount,
      chainId,
      takerAddress,
      feeRecipient: FEE_RECIPIENT,
      buyTokenPercentageFee: AFFILIATE_FEE,
      feeRecipientTradeSurplus: FEE_RECIPIENT,
    };

    async function fetchPrice() {
      const response = await fetch(`/api/price?${qs.stringify(params)}`);
      const data: ZeroExApiPriceResponse = await response.json();

      if (data?.validationErrors?.length > 0) {
        setError(data.validationErrors);
      } else {
        setError([]);
      }
      if (data.buyAmount) {
        setBuyAmount(formatUnits(BigInt(data.buyAmount), buyTokenDecimals));
        setPriceResponse && setPriceResponse(data);
      }
    }

    if (sellAmount !== "") {
      fetchPrice();
    }
  }, [
    sellTokenData,
    buyTokenData,
    parsedSellAmount,
    chainId,
    sellAmount,
    setPrice,
    FEE_RECIPIENT,
    AFFILIATE_FEE,
  ]);

  return (
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
            <TokenSelector
              selectedToken={sellToken}
              onTokenChange={handleSellTokenChange}
            />
          </div>
          <div className="flex flex-col justify-center gap-y-4 items-end">
            <span className="text-muted-foreground text-xs mt-4 mr-6">
              Balance:{" "}
              {!balance || balance?.formatted == "0" ? "-" : balance?.formatted}
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
                onClick={handleSetSellAmountToHalfBalance}
                disabled={!balance || balance.formatted === "0"}
              >
                50%
              </Button>
              <Button
                className="mx-1 rounded-full text-foreground bg-zinc-300/20 hover:bg-zinc-400/20 flex items-center gap-x-1.5 transition-all"
                onClick={() => {
                  setSellAmount(balance?.formatted as string);
                }}
                disabled={!balance || balance.formatted === "0"}
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
          <TokenSelector
            selectedToken={buyToken}
            onTokenChange={handleBuyTokenChange}
          />
        </div>
        <div className="flex flex-col justify-between items-start rounded overflow-hidden pt-0 pb-4 p-2">
          <Input
            id="buy-amount"
            type="number"
            placeholder="0.0"
            className="w-full p-3 border-none ring-0 text-3xl font-medium placeholder:text-zinc-400 text-zinc-600 cursor-not-allowed"
            defaultValue={buyAmount}
          />
          <div className="text-zinc-400 ml-0.5 text-sm px-3 pt-3">
            {buyAmount
              ? "Fee: " +
                (Number(buyAmount) * AFFILIATE_FEE).toFixed(
                  getTokensBySymbolByChain(chainId)[buyToken].decimals
                ) +
                " " +
                getTokensBySymbolByChain(chainId)[buyToken].symbol
              : null}
          </div>
        </div>
      </div>
      <hr className="border-zinc-200/50" />
      {error.length > 0 &&
        error.map(({ field, code, reason, description }, index) => (
          <span key={index} className="text-red-500 text-sm">
            [{code}] {reason} - {description}
          </span>
        ))}
    </form>
  );
};

export default PriceForm;
