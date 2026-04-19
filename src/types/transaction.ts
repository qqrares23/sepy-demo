export interface Transaction {
  id: string;
  type: "Receive" | "Send" | "Swap" | "Buy" | "Sell" | "NFT Buy" | "NFT Sell";
  asset: string;
  amount: string;
  value: string;
  time: string;
  status: "Completed" | "Pending" | "Failed";
  from: string;
  to: string;
  gas: string;
}

export interface SwapTx {
  id: string;
  time: string;
  from: string;
  to: string;
  value: string;
  status: string;
  gas: string;
}
