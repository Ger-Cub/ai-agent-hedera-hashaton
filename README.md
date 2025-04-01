# Build a Blockchain AI Agent with Hedera + LangGraph Project

Accompanying code for the Blockchain AI Agent with Hedera + LangGraph Workshop.

## Project

This repo contains the code required to configure and run Eliza,
then use Hedera AI agents to query and transact on Hedera.
The following sections outline what each sequence will cover.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ger-Cub/ai-agent-hedera-hashaton.git
   cd ai-agent-hedera-hashaton
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables:
   - Create a `.env` file based on the `.env.sample` provided in the repository.

## Running the Project

1. Start the server:
   ```bash
   node agent.js
   ```

2. Access the UI:
   - Open your browser and navigate to `http://localhost:3000` (or the appropriate port if specified).

## Recent Updates

- Added error handling to the `deploy.js` script to capture and log any errors that occur during the contract deployment process. This enhancement improves the debugging experience and provides more context when issues arise.

## Authors

[Brendan Graetz](https://blog.bguiz.com/)
[Gerard](https://ger-cub.github.io/portfoliogerard/)

## Licence

MIT
