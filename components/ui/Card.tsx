import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export default function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={`rounded-xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${className}`}
    >
      {children}
    </div>
  );
}