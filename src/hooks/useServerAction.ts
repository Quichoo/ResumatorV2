"use client";

import { useCallback, useRef, useState } from "react";

type ActionResultBase = {
  success: boolean;
  message: string;
};

type UnexpectedActionFailure = {
  success: false;
  message: string;
  fieldErrors?: undefined;
};

type UseServerActionOptions = {
  errorMessage?: string;
};

export function useServerAction<
  TArgs extends unknown[],
  TResult extends ActionResultBase,
>(
  action: (...args: TArgs) => Promise<TResult>,
  {
    errorMessage = "Unable to complete the request. Please try again.",
  }: UseServerActionOptions = {},
) {
  type Result = TResult | UnexpectedActionFailure;

  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  // This lock changes immediately, before React renders again.
  const inFlight = useRef(false);

  const execute = useCallback(
    async (...args: TArgs): Promise<Result | null> => {
      if (inFlight.current) return null;

      inFlight.current = true;
      setIsPending(true);
      setResult(null);

      try {
        const response = await action(...args);

        setResult(response);
        return response;
      } catch {
        const failure: UnexpectedActionFailure = {
          success: false,
          message: errorMessage,
        };

        setResult(failure);
        return failure;
      } finally {
        inFlight.current = false;
        setIsPending(false);
      }
    },
    [action, errorMessage],
  );

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  const clearSuccess = useCallback(() => {
    setResult((current) => (current?.success ? null : current));
  }, []);

  return {
    execute,
    isPending,
    result,
    clearResult,
    clearSuccess,
  };
}
