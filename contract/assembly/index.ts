
import { Context, logging, ContractPromiseBatch, u128 } from 'near-sdk-as'
import { TransferTransaction, transactions } from './model';

const MESSAGE_LIMIT = 10;

export function getTransactions(): Array<TransferTransaction> {
  const numMessages = min(MESSAGE_LIMIT, transactions.length);
  const startIndex = transactions.length - numMessages;
  const result = new Array<TransferTransaction>(numMessages);
  for(let i = 0; i < numMessages; i++) {
    result[i] = transactions[i + startIndex];
  }
  return result.reverse();
}

export function transferTokens(amount: string): void {
  logging.log(`Sending money "${amount}" for account "${Context.contractName}" from account "${Context.sender}"`)
  ContractPromiseBatch.create(Context.contractName).transfer( u128.from(amount))
  const transaction = new TransferTransaction(u128.from(amount))
  transactions.push(transaction)
}
