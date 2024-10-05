import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { type Token } from "@/lib/constants";
import { getTokensByChain } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

interface TokenSelectorProps {
  selectedToken: string;
  onTokenChange: (token: string) => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onTokenChange,
}) => {
  const [tokens, setTokens] = useState<Token[]>([]);

  const { chain } = useAccount();

  useEffect(() => {
    setTokens(getTokensByChain(chain?.id as number));
  }, [chain?.id]);

  return (
    <Select value={selectedToken} onValueChange={onTokenChange}>
      <SelectTrigger className="w-fit bg-muted/50 rounded-3xl hover:border-zinc-300 hover:bg-muted transition-all">
        <SelectValue placeholder={selectedToken} />
      </SelectTrigger>
      <SelectContent className="rounded-3xl">
        {tokens.map((token) => (
          <SelectItem key={token.address} value={token.symbol.toLowerCase()}>
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
        ))}
      </SelectContent>
    </Select>
  );
};

export default TokenSelector;
