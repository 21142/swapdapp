"use client";

import { useChartPrices } from "@/hooks/useChartPrices";
import { ONE_HOUR_IN_DAYS } from "@/lib/constants";
import { AxisBottom } from "@visx/axis";
import { localPoint } from "@visx/event";
import { LinearGradient } from "@visx/gradient";
import { Group } from "@visx/group";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AreaClosed, Bar, Line, LinePath } from "@visx/shape";
import { defaultStyles, TooltipWithBounds, useTooltip } from "@visx/tooltip";
import { bisector, extent } from "d3-array";
import { curveMonotoneX } from "d3-shape";
import { timeFormat } from "d3-time-format";
import {
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
  type TouchEvent,
} from "react";
import useMeasure from "react-use-measure";
import { type DataPoint } from "../../types";
import Spinner from "./Spinner";

const getXValue = (d: DataPoint) => new Date(d[0]);
const getYValue = (d: DataPoint) => d[1];
const bisect = bisector<DataPoint, Date>(getXValue).left;

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 3,
});

type Props = {
  sellToken: string;
  buyToken: string;
  period: number;
  setPrice: Dispatch<SetStateAction<string | undefined>>;
  setDelta: Dispatch<SetStateAction<number | undefined>>;
};

const greenStroke = "rgba(0, 185, 109, 1)";

const redStroke = "rgba(255, 102, 110, 1)";

const greenGradient = "rgba(225, 250, 239, 1)";

const redGradient = "rgba(255, 225, 225, 1)";

const PriceChart = ({
  sellToken,
  buyToken,
  period,
  setPrice,
  setDelta,
}: Props) => {
  const { data, delta, isLoading, error } = useChartPrices({
    sellToken,
    buyToken,
    period,
    setPrice,
    setDelta,
  });

  const chartStroke = delta && delta > 0 ? greenStroke : redStroke;

  const chartGradientFrom = delta && delta > 0 ? greenGradient : redGradient;
  const chartGradientTo = delta && delta > 0 ? greenGradient : redGradient;

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
      <div className="w-full h-[246px] flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (error)
    return (
      <div className="flex px-8 text-center w-full h-full items-center justify-center">
        Error fetching chart, most likely due to too many requests
      </div>
    );
  if (!data || !Array.isArray(data) || data.length < 2)
    return (
      <div className="flex px-8 text-center w-full h-full items-center justify-center">
        No data available to display on chart.
      </div>
    );

  const width = bounds.width || 100;
  const height = bounds.height || 100;

  const margin = { top: 10, right: 0, bottom: 10, left: 0 };

  const innerHeight = height - margin.top - margin.bottom;

  const xScale = scaleTime({
    range: [0, width],
    domain: extent(data, getXValue) as [Date, Date],
  });

  const yScale = getDynamicYScale(data, getYValue, period, innerHeight);

  const tooltipStyles = {
    ...defaultStyles,
    minWidth: 80,
    borderRadius: 24,
    border: "1px solid #71717a",
    backgroundColor: "white",
  };

  const handleTooltip = (
    event: TouchEvent<SVGRectElement> | MouseEvent<SVGRectElement>
  ) => {
    const { x } = localPoint(event) || { x: 0 };

    const x0 = xScale.invert(x);

    const index = bisect(data, x0, 1);

    const d0 = data[index - 1];
    const d1 = data[index];

    let d = d0;

    if (d1 && getXValue(d1)) {
      d =
        x0.valueOf() - getXValue(d0).valueOf() >
        getXValue(d1).valueOf() - x0.valueOf()
          ? d1
          : d0;
    }

    showTooltip({
      tooltipData: d,
      tooltipLeft: x,
      tooltipTop: yScale(getYValue(d)),
    });
  };

  function getDynamicYScale(
    data: DataPoint[],
    getYValue: (d: DataPoint) => number,
    period: number,
    height: number
  ) {
    const minY = Math.min(...data.map(getYValue));
    const maxY = Math.max(...data.map(getYValue));

    let adjustedMinY = minY;
    let adjustedMaxY = maxY;

    if (period === ONE_HOUR_IN_DAYS) {
      const padding = 0.01;

      adjustedMinY -= padding;
      adjustedMaxY += padding;
    }

    return scaleLinear({
      range: [height, 0],
      domain: [adjustedMinY, adjustedMaxY],
    });
  }

  function setNumberOfTicksBasedOnWidth(width: number): number | undefined {
    if (width < 400) {
      return 4;
    } else if (width < 600) {
      return 5;
    } else {
      return 8;
    }
  }

  return (
    <>
      <svg
        ref={ref}
        width="100%"
        height="320"
        viewBox={`0 0 ${width} ${height}`}
      >
        <LinearGradient
          id="area-gradient"
          from={chartGradientFrom}
          to={chartGradientTo}
          fromOpacity={1}
          toOpacity={0}
          fromOffset={"0%"}
          toOffset={"100%"}
        />

        <Group>
          <AreaClosed<DataPoint>
            data={data}
            x={(d) => xScale(getXValue(d)) ?? 0}
            y={(d) => yScale(getYValue(d)) ?? 0}
            yScale={yScale}
            strokeWidth={2}
            stroke="url(#area-gradient)"
            fill="url(#area-gradient)"
            curve={curveMonotoneX}
          />
          <LinePath<DataPoint>
            data={data}
            x={(d) => xScale(getXValue(d)) ?? 0}
            y={(d) => yScale(getYValue(d)) ?? 0}
            stroke={chartStroke}
            fill="transparent"
            strokeWidth={2}
            curve={curveMonotoneX}
          />
        </Group>

        <Group>
          <Bar
            width={width}
            height={height}
            fill="transparent"
            onMouseMove={handleTooltip}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
        </Group>

        {tooltipData && (
          <Group>
            <Line
              from={{ x: tooltipLeft, y: 0 }}
              to={{ x: tooltipLeft, y: height }}
              stroke="#71717a"
              strokeWidth={1}
              pointerEvents="none"
              strokeDasharray="5,5"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={8}
              fill="#71717a"
              pointerEvents="none"
              fillOpacity={0.5}
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill="#3f3f46"
              pointerEvents="none"
            />
          </Group>
        )}
        <AxisBottom
          scale={xScale}
          top={innerHeight}
          stroke="none"
          tickStroke="none"
          numTicks={setNumberOfTicksBasedOnWidth(width)}
          tickFormat={(value) => {
            if (period === ONE_HOUR_IN_DAYS || period === 1) {
              return timeFormat("%H:%M %p")(value as Date);
            } else if (period === 365) {
              return timeFormat("%b %d, %y")(value as Date);
            }
            return timeFormat("%b %d")(value as Date);
          }}
          tickLabelProps={() => ({
            fill: "#B4B4B4",
            fontSize: 12,
            textAnchor: "middle",
          })}
        />
      </svg>
      {tooltipData && (
        <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div className="flex flex-col items-start p-2">
            <span className="font-medium text-lg">
              {formatter.format(getYValue(tooltipData))}
            </span>
            <span className="text-zinc-400">
              {`${timeFormat("%b %d, %I %p")(
                new Date(getXValue(tooltipData))
              )}`}
            </span>
          </div>
        </TooltipWithBounds>
      )}
    </>
  );
};

export default PriceChart;
