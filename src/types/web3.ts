export type ModalType =
  | "connect"
  | "sign"
  | "deploy"
  | "bridge"
  | "nft"
  | "stake"
  | "disconnect"
  | "txSuccess"
  | null;

export interface NFT {
  id: string;
  name: string;
  collection: string;
  floor: string;
  color: string;
  rarity: string;
}

export interface Protocol {
  name: string;
  apy: string;
  tvl: string;
  icon: string;
  color: string;
  staked: string;
}

export interface Chain {
  name: string;
  symbol: string;
  icon: string;
  color: string;
  balance: string;
}
