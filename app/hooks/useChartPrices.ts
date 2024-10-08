import { useQuery } from "@tanstack/react-query";
import { type Dispatch, type SetStateAction } from "react";
import { type DataPoint } from "../../types";

type GetChartPricesParams = {
  sellToken: string;
  buyToken: string;
  period: number;
  setPrice: Dispatch<SetStateAction<string | undefined>>;
  setDelta: Dispatch<SetStateAction<number | undefined>>;
};

const getChartPrices = async ({
  sellToken,
  buyToken,
  period,
  setPrice,
  setDelta,
}: GetChartPricesParams): Promise<DataPoint[]> => {
  const res = await fetch(
    `/api/chart?sellToken=${sellToken}&buyToken=${buyToken}&period=${period}`
  );

  if (!res.ok) {
    console.error("Failed to fetch price:", res.statusText);
    return [];
  }

  const data = (await res.json()) as DataPoint[];

  if (data.length === 0) return data;

  const firstDataPoint = data[0];
  const lastDataPoint = data[data.length - 1];

  const firstPrice = firstDataPoint ? firstDataPoint[1] : 0;
  const currentPrice = lastDataPoint ? lastDataPoint[1] : 0;

  const delta = ((currentPrice - firstPrice) / firstPrice) * 100;

  if (setPrice) {
    setPrice(currentPrice.toFixed(3));
  }

  if (setDelta) {
    setDelta(delta);
  }

  return data;
};

export const useChartPrices = ({
  sellToken,
  buyToken,
  period,
  setPrice,
  setDelta,
}: GetChartPricesParams) => {
  const { data, ...queryInfo } = useQuery<DataPoint[]>({
    queryKey: ["prices", sellToken, buyToken, period],
    queryFn: () =>
      getChartPrices({ sellToken, buyToken, period, setPrice, setDelta }),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const delta = data
    ? data.length > 0
      ? ((data[data.length - 1][1] - data[0][1]) / data[0][1]) * 100
      : undefined
    : undefined;

  return { data, delta, ...queryInfo };
};
