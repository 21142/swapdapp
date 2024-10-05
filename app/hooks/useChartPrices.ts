import { useQuery } from "@tanstack/react-query";
import { type Dispatch, type SetStateAction } from "react";
import { type DataPoint } from "../../types";

type GetChartPricesParams = {
  sellToken: string;
  buyToken: string;
  period: number;
  setPrice: Dispatch<SetStateAction<string | undefined>>;
};

const getChartPrices = async ({
  sellToken,
  buyToken,
  period,
  setPrice,
}: GetChartPricesParams): Promise<DataPoint[]> => {
  const res = await fetch(
    `/api/chart?sellToken=${sellToken}&buyToken=${buyToken}&period=${period}`
  );

  if (!res.ok) {
    console.error("Failed to fetch price:", res.statusText);
    return [];
  }

  const data = (await res.json()) as DataPoint[];
  const lastDataPoint = data[data.length - 1];
  const currentPrice = lastDataPoint ? lastDataPoint[1] : 0;

  if (setPrice) {
    setPrice(currentPrice.toFixed(3));
  }

  return data;
};

export const useChartPrices = ({
  sellToken,
  buyToken,
  period,
  setPrice,
}: GetChartPricesParams) => {
  return useQuery<DataPoint[]>({
    queryKey: ["prices", sellToken, buyToken, period],
    queryFn: () => getChartPrices({ sellToken, buyToken, period, setPrice }),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
