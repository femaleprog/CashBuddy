import * as React from "react";
import { cn } from "../../lib/utils";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    valueDisplay?: string | number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, label, valueDisplay, ...props }, ref) => {
        return (
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    {label && <label className="text-sm font-medium text-muted-foreground">{label}</label>}
                    {valueDisplay && <span className="text-sm font-bold text-primary">{valueDisplay}</span>}
                </div>
                <input
                    type="range"
                    className={cn(
                        "w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
Slider.displayName = "Slider";

export { Slider };
