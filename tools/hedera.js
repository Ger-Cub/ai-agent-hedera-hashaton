import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { TopicCreateTransaction, TopicMessageSubmitTransaction, AccountBalanceQuery } from '@hashgraph/sdk';
import { createInstance } from '../api/hedera-client.js';

const client = createInstance();

/* CMD_HCS_CREATE_TOPIC */
const commandHcsCreateTopicDef = {
  name: 'CMD_HCS_CREATE_TOPIC',
  description: 'create a new HCS Topic',
  schema: z.object({
    memo: z.string().describe('a memo for the topic with'),
  }),
};

async function commandHcsCreateTopicImpl(inputs) {
  const { memo } = inputs;
  const tx = await new TopicCreateTransaction()
    .setTopicMemo(memo)
    .freezeWith(client);
  const txId = tx.transactionId;
  const txSigned = await tx.signWithOperator(client);
  const txSubmitted = await txSigned.execute(client);
  const txReceipt = await txSubmitted.getReceipt(client);
  const topicId = txReceipt.topicId;
  return {
    txId: txId.toString(),
    topicId: topicId.toStringWithChecksum(client),
  };
}

const commandHcsCreateTopicTool = tool(commandHcsCreateTopicImpl, commandHcsCreateTopicDef);

/* CMD_HCS_SUBMIT_TOPIC_MESSAGE */
const commandHcsSubmitTopicMessageDef = {
  name: 'CMD_HCS_SUBMIT_TOPIC_MESSAGE',
  description: 'submit a message to an existing HCS topic',
  schema: z.object({
    topicId: z.string().describe('the ID of the HCS topic to submit a message to'),
    message: z.string().describe('the text of the message to submit'),
  }),
};

async function commandHcsSubmitTopicMessageImpl(inputs) {
  const { topicId, message } = inputs;
  const tx = await new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(message)
    .freezeWith(client);
  const txId = tx.transactionId;
  const txSigned = await tx.signWithOperator(client);
  const txSubmitted = await txSigned.execute(client);
  const txReceipt = await txSubmitted.getReceipt(client);
  const topicSequenceNumber = txReceipt.topicSequenceNumber;
  return {
    txId: txId.toString(),
    topicSequenceNumber,
  };
}

const commandHcsSubmitTopicMessageTool = tool(commandHcsSubmitTopicMessageImpl, commandHcsSubmitTopicMessageDef);

/* CMD_HCS_GET_ACCOUNT_BALANCE */
const commandHcsGetAccountBalanceDef = {
  name: 'CMD_HCS_GET_ACCOUNT_BALANCE',
  description: 'get the balance of a Hedera account',
  schema: z.object({
    accountId: z.string().describe('the ID of the Hedera account to query'),
  }),
};

async function commandHcsGetAccountBalanceImpl(inputs) {
  const { accountId } = inputs;
  const balance = await new AccountBalanceQuery()
    .setAccountId(accountId)
    .execute(client);
  return {
    accountId,
    balance: balance.hbars.toString(),
  };
}

const commandHcsGetAccountBalanceTool = tool(commandHcsGetAccountBalanceImpl, commandHcsGetAccountBalanceDef);

const allHederaTools = [
  commandHcsCreateTopicTool,
  commandHcsSubmitTopicMessageTool,
  commandHcsGetAccountBalanceTool, // Added new tool
];

export {
  commandHcsCreateTopicTool,
  commandHcsSubmitTopicMessageTool,
  commandHcsGetAccountBalanceTool, // Exporting new tool
  allHederaTools,
};
