import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
}

export function Card({
  className,
  padding = "md",
  hover = false,
  children,
  ...props
}: CardProps) {
  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "rounded-[20px] bg-surface shadow-[0_8px_30px_rgba(58,46,42,0.06)]",
        paddingStyles[padding],
        hover && "transition-shadow duration-200 hover:shadow-[0_20px_40px_rgba(184,107,82,0.12)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
