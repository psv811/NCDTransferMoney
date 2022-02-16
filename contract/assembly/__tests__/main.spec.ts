import { transferTokens, getTransactions } from '../index'
import {transactions} from '../model'
import { u128, VMContext, Context} from "near-sdk-as";

const CURRENT_ACCOUNT_ID = 'currentAccount';
const SENDER_ACCOUNT = 'senderAccount';
const AMOUNT = '120';
const AMOUNT_2 = '200';
const INITIAL_ACCOUNT_BALANCE = '1000';
describe('Tokens transfer ', () => {

  beforeEach(() =>  {
    VMContext.setCurrent_account_id(CURRENT_ACCOUNT_ID)
    VMContext.setAttached_deposit(u128.from('0'))
    VMContext.setAccount_balance(u128.from(INITIAL_ACCOUNT_BALANCE))
    VMContext.setSigner_account_id(SENDER_ACCOUNT)
  })

  afterEach(() => {
    while(transactions.length > 0) {
      transactions.pop();
    }
  });

  it('should save transaction and get transactions when transfer tokens', () => {
    transferTokens(AMOUNT)
    let transactions = getTransactions()
    expect(transactions).not.toBeNull()
    expect(transactions.length).toBe(
        1,
        'should only contain one message'
    );
    expect(transactions[0].amount).toBe(u128.from(AMOUNT))
    expect(transactions[0].sender).toBe(SENDER_ACCOUNT)
    expect(transactions[0].receiver).toBe(CURRENT_ACCOUNT_ID)
  })

  it('should save multiple transaction and get transactions in reverse order when transfer tokens multiple times', () => {
    transferTokens(AMOUNT)
    transferTokens(AMOUNT_2)
    let transactions = getTransactions()
    expect(transactions).not.toBeNull()
    expect(transactions.length).toBe(
        2,
        'should only contain two messages'
    );
    expect(transactions[0].amount).toBe(u128.from(AMOUNT_2))
    expect(transactions[0].sender).toBe(SENDER_ACCOUNT)
    expect(transactions[0].receiver).toBe(CURRENT_ACCOUNT_ID)
    expect(transactions[1].amount).toBe(u128.from(AMOUNT))
    expect(transactions[1].sender).toBe(SENDER_ACCOUNT)
    expect(transactions[1].receiver).toBe(CURRENT_ACCOUNT_ID)
  })

  it('should save multiple more then 10 transactions and get transactions only last 10 transactions', () => {
    for(let i = 0; i < 20; i++) {
      transferTokens((i + 1).toString())
    }
    let transferTransactions = getTransactions()
    expect(transferTransactions).not.toBeNull()
    expect(transferTransactions.length).toBe(
        10,
        'should only contain 10 messages'
    );
    expect(transferTransactions[0].amount).toBe(u128.from('20'))
    expect(transferTransactions[9].amount).toBe(u128.from('11'))
    expect(transactions.length).toBe(20);
  })

  it('should transfer tokens to to account', () => {
    let expectedBalanceAfter = parseInt(INITIAL_ACCOUNT_BALANCE) - parseInt(AMOUNT)

    transferTokens(AMOUNT)

    expect(Context.accountBalance).toBe(u128.from(expectedBalanceAfter))
  })
})
