import React from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      {...props}
      className={`rounded-xl border border-slate-600 bg-slate-800 p-4 ${className ?? ""}`}
    >
      {children}
    </View>
  );
}
