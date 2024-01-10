import { cn } from "@/lib/utils";
import { Checkbox, Button } from "pakt-ui";

interface StepIndicatorProps {
    isComplete?: boolean;
    children: React.ReactNode;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ children, isComplete }) => {
    return (
        <label
            className={cn(
                "flex cursor-pointer items-center gap-4 rounded-lg border border-gray-300  border-opacity-50 bg-gray-50 px-3 py-3 duration-200 hover:bg-primary hover:bg-opacity-10",
                {
                    "border-primary border-opacity-40 bg-green-300 bg-opacity-10 duration-200 hover:bg-opacity-20":
                        isComplete,
                },
            )}
        >
            <Checkbox checked={isComplete} />
            <span>{children}</span>
        </label>
    );
};
