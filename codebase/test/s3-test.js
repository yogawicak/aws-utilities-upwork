const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { spawnSync } = require("child_process");
require("dotenv").config();

function getTerraformOutputs(terrDir) {
    const res = spawnSync("terraform", ["output", "-json"], { cwd: terrDir, encoding: "utf-8" });
    if (res.status !== 0) throw new Error(res.stderr || "terraform output failed");
    return JSON.parse(res.stdout);
}

function streamToString(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on("error", (err) => reject(err));
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });
}

async function main() {
    const TERRAFORM_DIR = "/Users/yogawicaksono/Desktop/YOGA_PUNYA/job-upwork-oliver-may/terraform";
    const outputs = getTerraformOutputs(TERRAFORM_DIR);
    const bucket = outputs.s3_bucket_name.value;
    const region = process.env.AWS_REGION || "us-east-1";

    const s3 = new S3Client({ region });
    const key = `test2-${Date.now()}.txt`;
    const body = `hello from test2 ${new Date().toISOString()}`;

    // Test 1: Upload object
    await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: "text/plain" }));
    console.log("uploaded", { bucket, key });

    // Test 2: Download object
    const got = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const text = await streamToString(got.Body);
    console.log("downloaded", { len: text.length, sample: text.slice(0, 80) });

    // Test 3: List objects
    const listed = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: key }));
    console.log("listedCount", listed.Contents ? listed.Contents.length : 0);

    // Test 4: Delete object
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    console.log("deleted", { bucket, key });
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

