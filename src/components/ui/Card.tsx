import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
    variant?: "default" | "glass" | "outline";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", children, ...props }, ref) => {
        const variants = {
            default: "bg-card text-card-foreground border shadow-sm",
            glass: "bg-background/60 backdrop-blur-xl border border-white/10 shadow-xl",
            outline: "bg-transparent border-2 border-dashed border-muted",
        };

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("rounded-xl p-6", variants[variant], className)}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
Card.displayName = "Card";

export { Card };
