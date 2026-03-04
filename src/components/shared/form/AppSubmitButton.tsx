"use clinet";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

type AppSubmitButtonProps = {
  isPending: boolean;
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  disabled?: boolean;
};

const AppSubmitButton = ({
  children,
  isPending,
  className,
  disabled = false,
  pendingLabel = "submiting......",
}: AppSubmitButtonProps) => {
  const isDisabled = disabled || isPending;
  return (
    <div>
      <Button
        type="submit"
        disabled={isDisabled}
        className={cn("w-full", className)}
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            {pendingLabel ? pendingLabel : children}
          </>
        ) : (
          children
        )}
      </Button>
    </div>
  );
};

export default AppSubmitButton;
