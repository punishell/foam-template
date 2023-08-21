import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IWallet {
  totalWalletBalance: string;
  value: string;
  wallets: [{
    _id: string;
    amount: number;
    usdValue: number;
    coin: string;
  }]
};

type WalletState = IWallet & {
  setWallet: (wallet: IWallet) => void;
};

export const useWalletState = create<WalletState>()(
  persist(
    (set) => ({
      totalWalletBalance: "0.00",
      value: "0.00",
      // @ts-ignore
      wallets:[],
      setWallet: (wallet) => set(wallet),
    }),
    {
      name: "wallet",
    }
  )
);