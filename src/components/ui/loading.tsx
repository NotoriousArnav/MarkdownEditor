import * as React from "react";
import { Spinner } from "@/components/ui/spinner";

export const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner size="large">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
};
