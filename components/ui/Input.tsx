import React, { forwardRef } from "react";
import { TextInput, Text, View, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <View className="mb-6">
        {label ? (
          <Text className="mb-2 text-xs font-medium text-slate-400">
            {label}
          </Text>
        ) : null}
        <TextInput
          ref={ref}
          placeholderTextColor="#64748B"
          {...props}
          className={`h-12 rounded-lg border bg-slate-800 px-3 text-base text-slate-100 ${
            error ? "border-red-500" : "border-slate-600 focus:border-amber-400"
          } ${className ?? ""}`}
        />
        {error ? (
          <Text className="mt-1 text-xs text-red-500">{error}</Text>
        ) : hint ? (
          <Text className="mt-1 text-xs text-slate-500">{hint}</Text>
        ) : null}
      </View>
    );
  },
);

Input.displayName = "Input";
