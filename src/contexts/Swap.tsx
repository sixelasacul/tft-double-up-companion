import { createContext, PropsWithChildren, useContext, useState } from "react";

type SwapState = [boolean, () => void];

const SwapContext = createContext<SwapState | null>(null);

export function useSwap() {
  const ctx = useContext(SwapContext);
  if (!ctx) {
    throw new Error("useSwap should not be called outside SwapContext");
  }
  return ctx;
}

const SWAP_STORAGE_KEY = "swap";

function getSwap(): boolean {
  return localStorage.getItem(SWAP_STORAGE_KEY) === "true";
}

function saveSwap(shouldSwap: boolean) {
  localStorage.setItem(SWAP_STORAGE_KEY, String(shouldSwap));
}

export function SwapProvider({ children }: PropsWithChildren) {
  const [shouldSwap, setSwap] = useState<boolean>(getSwap());

  function toggleSwap() {
    saveSwap(!shouldSwap);
    setSwap(!shouldSwap);
  }

  return (
    <SwapContext.Provider value={[shouldSwap, toggleSwap]}>
      {children}
    </SwapContext.Provider>
  );
}
