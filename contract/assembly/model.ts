import { context, u128, PersistentVector } from "near-sdk-as";


@nearBindgen
export class TransferTransaction {
  receiver: string;
  sender: string;
  amount: u128;
  constructor(public money: u128) {
    this.receiver = context.contractName;
    this.amount = money;
    this.sender = context.sender;
  }
}

export const transactions = new PersistentVector<TransferTransaction>("m");
