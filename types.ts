export enum MetalType {
  Gold = 'GOLD',
  KGold = 'K_GOLD',
  Platinum = 'PLATINUM'
}

export const MetalTypeLabels: Record<MetalType, string> = {
  [MetalType.Gold]: '黃金',
  [MetalType.KGold]: 'K金',
  [MetalType.Platinum]: '鉑金',
};

export enum TransactionType {
  Buy = 'BUY',
  Sell = 'SELL'
}

export const TransactionTypeLabels: Record<TransactionType, string> = {
  [TransactionType.Buy]: '買入',
  [TransactionType.Sell]: '賣出',
};

export enum Currency {
  TWD = 'TWD',
  RMB = 'RMB',
  USD = 'USD'
}

export enum WeightUnit {
  Qian = '台錢',
  Gram = 'g',
  Ounce = 'oz'
}

export interface User {
  id: string;
  name: string;
  email: string;
  defaultCurrency: Currency;
  thirdPartyId?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  metalType: MetalType;
  date: string; // purchase_date
  weight: number;
  weightUnit: WeightUnit;
  pricePerUnit: number; // price_per_unit
  currency: Currency;
  laborCost: number; // labor_fee
  totalAmount: number; // total_cost_local
  exchangeRate: number; // exchange_rate
  channel: string; // source_channel
  notes?: string; // memo
  imageUrl?: string; // photo_url
  createdAt: string;
}

export interface PriceCache {
  id: string;
  metalType: MetalType;
  date: string;
  price: number;
  currency: Currency;
  weightUnit: WeightUnit;
  updatedAt: string;
}

export type Tab = 'home' | 'add' | 'records' | 'charts' | 'settings';
