import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AnyFieldApi } from "@tanstack/react-form";
import React from "react";

const getErrorMessage = (error: unknown) => {
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }

  return String(error);
};

type AppFieldProps = {
  field: AnyFieldApi;
  label?: string;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const AppField = ({
  field,
  label,
  append,
  className,
  disabled = false,
  placeholder,
  prepend,
  type = "text",
}: AppFieldProps) => {
  const firstError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0
      ? getErrorMessage(field.state.meta.errors[0])
      : undefined;

  const hasError = !!firstError;

  return (
    <div
      className={cn("space-y-1.5 w-full flex flex-col items-start", className)}
    >
      <Label
        htmlFor={field.name}
        className={cn(
          "text-sm font-semibold transition-colors",
          hasError ? "text-destructive" : "text-foreground",
        )}
      >
        {label}
      </Label>

      <div className="relative w-full group">
        {/* Prepend Section (Left Icon) */}
        {prepend && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none">
            {prepend}
          </div>
        )}

        {/* Input Field */}
        <Input
          id={field.name}
          name={field.name}
          type={type}
          value={field.state.value}
          placeholder={placeholder}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          disabled={disabled}
          className={cn(
            "transition-all duration-200",
            prepend && "pl-10",
            append && "pr-10",
            hasError && "border-destructive focus-visible:ring-destructive/30",
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${field.name}-error` : undefined}
        />

        {/* Append Section (Right Icon/Button) */}
        {append && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
            {append}
          </div>
        )}
      </div>

      {/* Error Message Section */}
      {hasError && (
        <p
          id={`${field.name}-error`}
          role="alert"
          className="text-xs font-medium text-destructive mt-1 animate-in slide-in-from-top-1 fade-in duration-200"
        >
          {firstError}
        </p>
      )}
    </div>
  );
};

export default AppField;
