const { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand, GetQueueAttributesCommand } = require("@aws-sdk/client-sqs");
const { spawnSync } = require("child_process");
require("dotenv").config();

function getTerraformOutputs(terrDir) {
    const res = spawnSync("terraform", ["output", "-json"], { cwd: terrDir, encoding: "utf-8" });
    if (res.status !== 0) throw new Error(res.stderr || "terraform output failed");
    return JSON.parse(res.stdout);
}

async function main() {
    const TERRAFORM_DIR = "/Users/yogawicaksono/Desktop/YOGA_PUNYA/job-upwork-oliver-may/terraform";
    const outputs = getTerraformOutputs(TERRAFORM_DIR);
    const queueUrl = outputs.sqs_queue_url.value;
    const region = process.env.AWS_REGION || "us-east-1";

    const sqs = new SQSClient({ region });
    const body = JSON.stringify({ testId: Date.now(), message: "hello from test2" });

    // Test 1: Send message
    await sqs.send(new SendMessageCommand({ QueueUrl: queueUrl, MessageBody: body }));
    console.log("sent", { queueUrl });

    // Test 2: Receive message
    const attrs = await sqs.send(new GetQueueAttributesCommand({ QueueUrl: queueUrl, AttributeNames: ["ApproximateNumberOfMessages"] }));
    console.log("approxMessages", attrs.Attributes?.ApproximateNumberOfMessages || "0");

    // Test 3: Receive message
    let received = null;
    for (let i = 0; i < 5 && !received; i++) {
        const resp = await sqs.send(new ReceiveMessageCommand({ QueueUrl: queueUrl, MaxNumberOfMessages: 1, WaitTimeSeconds: 10 }));
        if (resp.Messages && resp.Messages.length > 0) received = resp.Messages[0];
    }
    if (!received) {
        console.log("noMessageReceived");
        return;
    }
    console.log("received", { id: received.MessageId, body: received.Body.slice(0, 120) });

    // Test 4: Delete message
    await sqs.send(new DeleteMessageCommand({ QueueUrl: queueUrl, ReceiptHandle: received.ReceiptHandle }));
    console.log("deletedMessage", { id: received.MessageId });
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

