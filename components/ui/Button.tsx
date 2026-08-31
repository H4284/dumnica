"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("common");
  const variantClasses = {
    primary: "btn btn-primary",
    secondary: "btn btn-ghost",
    danger: "btn bg-danger text-white",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`${variantClasses[variant]} ${
        disabled || loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${props.className ?? ""}`}
    >
      {loading ? t("loading") : children}
    </button>
  );
}
