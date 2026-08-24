"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
  children: ReactNode;
};

export default function Button({
  variant = "primary",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary:
      "bg-primary text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98]",
    secondary:
      "border border-border bg-surface text-primary hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98]",
    danger:
      "bg-danger text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger active:scale-[0.98]",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`inline-flex min-h-11 items-center justify-center rounded-md px-5 py-2.5 text-base font-medium transition-all duration-200 ${variantClasses[variant]} ${
        disabled || loading
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer"
      } ${props.className ?? ""}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}