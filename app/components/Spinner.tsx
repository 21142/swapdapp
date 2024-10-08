import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const Spinner: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        className ?? "h-8 w-8",
        `inline-block animate-spin rounded-full border-4 border-solid border-current border-e-transparent text-[#3dae76] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status`
      )}
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

export default Spinner;
