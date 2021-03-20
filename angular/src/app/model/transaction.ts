export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  description: string;
  completed: boolean;
  dateTime: Date;
  person: number;
}

export enum TransactionType {
  CREDIT = 'C',
  DEBT = 'D',
  SETTLE_CREDIT = 'SC',
  SETTLE_DEBT = 'SD'
}
