const { EventBridgeClient, PutEventsCommand } = require("@aws-sdk/client-eventbridge");
const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");
const { spawnSync } = require("child_process");
require("dotenv").config();

function getTerraformOutputs(terrDir) {
    const res = spawnSync("terraform", ["output", "-json"], { cwd: terrDir, encoding: "utf-8" });
    if (res.status !== 0) throw new Error(res.stderr || "terraform output failed");
    return JSON.parse(res.stdout);
}

function parseRuleArn(arn) {
    const resource = arn.split(":")[5];
    const parts = resource.split("/");
    if (parts.length === 2) return { bus: "default", rule: parts[1] };
    if (parts.length === 3) return { bus: parts[1], rule: parts[2] };
    return { bus: "default", rule: parts[parts.length - 1] };
}

async function main() {
    const TERRAFORM_DIR = "/Users/yogawicaksono/Desktop/YOGA_PUNYA/job-upwork-oliver-may/terraform";
    const outputs = getTerraformOutputs(TERRAFORM_DIR);
    const ruleArn = outputs.event_rule_arn.value;
    const queueUrl = outputs.sqs_queue_url.value;
    const region = process.env.AWS_REGION || "us-east-1";
    const { bus } = parseRuleArn(ruleArn);

    const eb = new EventBridgeClient({ region });
    const sqs = new SQSClient({ region });

    // Test 1: Publish event
    const detail = { testId: Date.now(), source: "myapp", payload: "hello-from-eventbridge-test2" };
    await eb.send(new PutEventsCommand({
        Entries: [
            {
                Source: "myapp",
                DetailType: "Test2Event",
                Detail: JSON.stringify(detail),
                EventBusName: bus
            }
        ]
    }));
    console.log("eventPublished", { bus, ruleArn });

    // Test 2: Receive message
    let msg = null;
    for (let i = 0; i < 6 && !msg; i++) {
        const resp = await sqs.send(new ReceiveMessageCommand({
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 10
        }));
        if (resp.Messages && resp.Messages.length > 0) msg = resp.Messages[0];
    }
    if (!msg) {
        console.log("noMessageDelivered");
        return;
    }
    console.log("messageDelivered", { id: msg.MessageId, bodySample: msg.Body.slice(0, 140) });
    await sqs.send(new DeleteMessageCommand({ QueueUrl: queueUrl, ReceiptHandle: msg.ReceiptHandle }));
    console.log("messageDeleted", { id: msg.MessageId });
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

