import { Client, PrivateKey, ContractCreateFlow, FileCreateTransaction } from "@hashgraph/sdk";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
    // Initialize Hedera client
    const client = Client.forTestnet();
    client.setOperator(process.env.HEDERA_ACCOUNT_ID, PrivateKey.fromStringECDSA(process.env.HEDERA_ACCOUNT_PRIVATE_KEY));

    // Read the compiled contract bytecode
    const bytecode = fs.readFileSync("./build/MyContract.bin", "utf8");

    // Step 1: Upload contract bytecode to Hedera File Service
    const fileCreateTx = new FileCreateTransaction()
        .setKeys([client.operatorPublicKey])
        .setContents(bytecode)
        .freezeWith(client);
    const fileCreateSubmit = await fileCreateTx.execute(client);
    const fileReceipt = await fileCreateSubmit.getReceipt(client);
    const fileId = fileReceipt.fileId;
    console.log(`✅ Smart contract bytecode uploaded to Hedera File Service with ID: ${fileId}`);

    // Step 2: Deploy contract
    const contractCreateTx = new ContractCreateFlow()
        .setBytecode(bytecode)
        .setGas(100000)
        .setConstructorParameters(["Hello, Hedera!"]); // Update with your constructor argument
let contractCreateSubmit;
try {
    contractCreateSubmit = await contractCreateTx.execute(client);
} catch (error) {
    console.error("Error during contract deployment:", error);
    process.exit(1); // Exit with an error code
}
    const contractReceipt = await contractCreateSubmit.getReceipt(client);
    const contractId = contractReceipt.contractId;
    console.log(`✅ Smart contract deployed with ID: ${contractId}`);

    // Exit script
    process.exit();
}

main().catch(console.error);
