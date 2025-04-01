#!/usr/bin/env node

import readline from 'node:readline/promises';
import process from 'node:process';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { HumanMessage } from '@langchain/core/messages';
import { queryJokeTool } from './tools/joke.js';
import { commandHcsCreateTopicTool, commandHcsSubmitTopicMessageTool, commandHcsGetAccountBalanceTool } from './tools/hedera.js'; // Updated to include new tool
import { createInstance } from './api/openrouter-openai.js';

const llm = createInstance();
const tools = [queryJokeTool, commandHcsCreateTopicTool, commandHcsSubmitTopicMessageTool, commandHcsGetAccountBalanceTool]; // Updated tools array
const checkpointSaver = new MemorySaver();
const agent = createReactAgent({
  llm,
  tools,
  checkpointSaver,
});

const rlp = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function readUserPrompt() {
  const lines = [];
  while (true) {
    const line = await rlp.question('');
    if (line == '' && lines[lines.length - 1] === '') {
      return lines.join('\n');
    }
    lines.push(line);
  }
}

async function obtainAgentReply(userPrompt) {
  // Security measure: Validate user input
  if (!userPrompt || userPrompt.trim() === '') {
    return "Invalid input. Please provide a valid prompt.";
  }

  const reply = await agent.invoke(
    {
      messages: [new HumanMessage(userPrompt)],
    },
    {
      configurable: { thread_id: '0x0001' },
    },
  );

  const agentReply = reply.messages[reply.messages.length - 1].content;
  return agentReply;
}

while (true) {
  console.log('You:\n');
  const userPrompt = await readUserPrompt();

  console.log('Agent:\n');
  const agentReply = await obtainAgentReply(userPrompt);
  console.log(agentReply);
}
