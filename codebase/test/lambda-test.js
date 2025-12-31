const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const { spawnSync } = require("child_process");
const path = require("path");
require("dotenv").config();

function getTerraformOutputs(terrDir) {
    const res = spawnSync("terraform", ["output", "-json"], { cwd: terrDir, encoding: "utf-8" });
    if (res.status !== 0) throw new Error(res.stderr || "terraform output failed");
    return JSON.parse(res.stdout);
}

async function main() {
    const TERRAFORM_DIR = path.join(process.cwd(), "../terraform");

    console.log("Fetching Terraform outputs...");
    const outputs = getTerraformOutputs(TERRAFORM_DIR);

    if (!outputs.translate_function_name) {
        throw new Error("translate_function_name output not found in Terraform. Did you apply the latest configuration?");
    }

    const functionName = outputs.translate_function_name.value;
    const region = process.env.AWS_REGION || "us-east-1";

    console.log(`Using Lambda function: ${functionName} in region: ${region}`);

    const client = new LambdaClient({ region });

    const payload = {
        text: "At dawn, the old lighthouse keeper discovered the sea had gone silent, waves frozen like glass around the rocks, as if time itself had paused to listen; he climbed the tower, heart trembling, and lit the lamp not for ships but for the ocean, whispering a promise that as long as one human still remembered wonder, he would keep the light burning—then the water sighed, moved again, and the world continued, slightly less lonely than before",
        sourceLanguageCode: "en",
        targetLanguageCode: "id"
    };

    console.log("Invoking Lambda with payload:", JSON.stringify(payload));

    const command = new InvokeCommand({
        FunctionName: functionName,
        Payload: JSON.stringify(payload),
    });

    try {
        const response = await client.send(command);

        // Response payload is a Uint8Array
        const responsePayload = Buffer.from(response.Payload).toString('utf-8');
        const parsedPayload = JSON.parse(responsePayload);

        console.log("Lambda Invocation Success!");
        console.log("Status Code:", response.StatusCode);
        console.log("Response Payload:", parsedPayload);

        if (parsedPayload.body) {
            const body = JSON.parse(parsedPayload.body);
            if (body.translatedText) {
                console.log("\nTranslated Text:", body.translatedText);
            }
        }

    } catch (error) {
        console.error("Error invoking Lambda:", error);
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
