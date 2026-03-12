import React from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  PressableProps,
} from "react-native";

type Variant = "primary" | "secondary" | "ghost" | "destructive";

interface ButtonProps extends PressableProps {
  variant?: Variant;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, { container: string; text: string }> = {
  primary: {
    container: "bg-amber-400 active:bg-amber-500",
    text: "text-slate-950 font-semibold",
  },
  secondary: {
    container: "bg-slate-700 border border-slate-600 active:bg-slate-600",
    text: "text-slate-100 font-semibold",
  },
  ghost: {
    container: "bg-transparent active:opacity-70",
    text: "text-amber-400 font-semibold",
  },
  destructive: {
    container: "bg-red-500 active:bg-red-600",
    text: "text-white font-semibold",
  },
};

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      className={`h-12 flex-row items-center justify-center rounded-lg px-4 ${styles.container} ${isDisabled ? "opacity-50" : ""} ${className ?? ""}`}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? "#0F172A" : "#F1F5F9"}
        />
      ) : (
        <Text className={`text-base ${styles.text}`}>{children}</Text>
      )}
    </Pressable>
  );
}
