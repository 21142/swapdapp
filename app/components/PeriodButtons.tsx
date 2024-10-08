import { Button } from "@/components/ui/Button";
import { periodLabels, periods, type PeriodsType } from "@/lib/constants";

interface PeriodButtonsProps {
  period: PeriodsType;
  setPeriod: (period: PeriodsType) => void;
  setDelta: (delta: number | undefined) => void;
}

const PeriodButtons: React.FC<PeriodButtonsProps> = ({
  period,
  setPeriod,
  setDelta,
}) => {
  const buttonData = Object.entries(periods).map(([key, value]) => ({
    value,
    label: periodLabels[key as keyof typeof periods],
  }));

  return (
    <div className="flex text-zinc-600 gap-1 items-center">
      {buttonData.map(({ value, label }) => (
        <Button
          key={value}
          variant={period === value ? "toned" : "ghost"}
          onClick={() => {
            setPeriod(value);
            setDelta(undefined);
          }}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default PeriodButtons;
