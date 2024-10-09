import {
  MAX_ALLOWANCE,
  POLYGON_AND_SEPOLIA_EXCHANGE_PROXY,
} from "@/lib/constants";
import { useEffect } from "react";
import { type Address, erc20Abi } from "viem";
import {
  useReadContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import Spinner from "./Spinner";
import { Button } from "./ui/Button";

type Props = {
  takerAddress: Address;
  sellTokenAddress: Address;
  disabled: boolean;
  onClick: () => void;
};

const ReviewAndApproveOrder = ({
  takerAddress,
  sellTokenAddress,
  disabled,
  onClick,
}: Props) => {
  const { data: allowance, refetch } = useReadContract({
    address: sellTokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: [takerAddress, POLYGON_AND_SEPOLIA_EXCHANGE_PROXY],
  });

  const { data } = useSimulateContract({
    address: sellTokenAddress,
    abi: erc20Abi,
    functionName: "approve",
    args: [POLYGON_AND_SEPOLIA_EXCHANGE_PROXY, MAX_ALLOWANCE],
  });

  const {
    data: writeContractResult,
    writeContractAsync: writeContract,
    error,
  } = useWriteContract();

  const {
    data: approvalReceiptData,
    isLoading: isApproving,
    isSuccess,
  } = useWaitForTransactionReceipt({
    hash: writeContractResult,
  });

  useEffect(() => {
    if (data || approvalReceiptData) {
      refetch();
    }
  }, [data, approvalReceiptData, refetch]);

  if (error) {
    return (
      <div className="w-full break-words">
        <span className="text-red-500">Something went wrong: </span>
        {error.message}
      </div>
    );
  }

  if (allowance === 0n) {
    return (
      <Button
        size="lg"
        className="font-bold py-2 px-4 rounded-full w-full"
        onClick={async () => {
          await writeContract({
            abi: erc20Abi,
            address: sellTokenAddress,
            functionName: "approve",
            args: [POLYGON_AND_SEPOLIA_EXCHANGE_PROXY, MAX_ALLOWANCE],
          });
          refetch();
        }}
      >
        {isApproving ? (
          <span className="flex items-center gap-x-2">
            Approving <Spinner className="h-6 w-6" />
          </span>
        ) : isSuccess ? (
          "Approved"
        ) : (
          "Approve"
        )}
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      disabled={disabled}
      onClick={onClick}
      className="w-full p-2 rounded-full disabled:opacity-25"
    >
      {disabled ? "Insufficient Balance" : "Review Trade"}
    </Button>
  );
};

export default ReviewAndApproveOrder;
