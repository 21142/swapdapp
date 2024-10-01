"use client";

import { useQuery } from "@tanstack/react-query";
import { DataPoint } from "../../types";
import { useTooltip } from "@visx/tooltip";
import useMeasure from "react-use-measure";
import { scaleLinear, scaleTime } from "@visx/scale";
import { extent } from "d3-array";
import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { curveMonotoneX } from "d3-shape";
import Spinner from "./Spinner";

const getPrices = async (period: number) => {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${period}`
  );
  const data = await res.json();

  const { prices } = data;
  return prices;
};

const getXValue = (d: DataPoint) => new Date(d[0]);
const getYValue = (d: DataPoint) => d[1];

type Props = {
  period: number;
};

const PriceChart = (props: Props) => {
  const { data, isLoading, error } = useQuery<DataPoint[]>({
    queryKey: ["prices", props.period],
    queryFn: () => getPrices(props.period),
  });

  const [ref, bounds] = useMeasure();

  const {
    tooltipData,
    showTooltip,
    hideTooltip,
    tooltipTop = 0,
    tooltipLeft = 0,
  } = useTooltip<DataPoint>();

  if (isLoading)
    return (
      <div className="w-full h-[30vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (error)
    return <div>Internal error, most likely due to too many requests</div>;
  if (!data) return <div>No data</div>;

  const width = bounds.width || 100;
  const height = bounds.height || 100;

  const xScale = scaleTime({
    range: [0, width],
    domain: extent(data, getXValue) as [Date, Date],
  });

  const yScale = scaleLinear({
    range: [height, 0],
    domain: [
      Math.min(...data.map(getYValue)),
      Math.max(...data.map(getYValue)),
    ],
  });

  return (
    <svg
      ref={ref}
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Group>
        <LinePath<DataPoint>
          data={data}
          x={(d) => xScale(getXValue(d)) ?? 0}
          y={(d) => yScale(getYValue(d)) ?? 0}
          stroke="#3dae76"
          strokeWidth={1.5}
          curve={curveMonotoneX}
        />
      </Group>
    </svg>
  );
};

export default PriceChart;
