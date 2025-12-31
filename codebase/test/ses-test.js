const https = require('https');
const { spawnSync } = require("child_process");
const path = require("path");
require("dotenv").config();

function getTerraformOutputs(terrDir) {
    const res = spawnSync("terraform", ["output", "-json"], { cwd: terrDir, encoding: "utf-8" });
    if (res.status !== 0) throw new Error(res.stderr || "terraform output failed");
    return JSON.parse(res.stdout);
}

// Configuration
const TERRAFORM_DIR = path.join(process.cwd(), "../terraform");
const outputs = getTerraformOutputs(TERRAFORM_DIR);

if (!outputs.ses_api_endpoint) {
    throw new Error("ses_api_endpoint output not found in Terraform. Did you apply the latest configuration?");
}

const API_ENDPOINT = outputs.ses_api_endpoint.value;
const TEST_EMAIL = 'success@simulator.amazonses.com'; // AWS SES Simulator Success Email

console.log(`Using API Endpoint: ${API_ENDPOINT}`);

const payload = JSON.stringify({
    to: TEST_EMAIL,
    subject: "Test Email from Node.js Script",
    text: "This is a test email sent via API Gateway + Lambda + SES.",
    html: "<h1>Test Email</h1><p>This is a test email sent via API Gateway + Lambda + SES.</p>"
});

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    }
};

const req = https.request(`${API_ENDPOINT}/send-email`, options, (res) => {
    let data = '';

    console.log(`Status Code: ${res.statusCode}`);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Response Body:', data);

        if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('✅ Test Passed: Email sent successfully!');
        } else {
            console.error('❌ Test Failed: API returned an error.');
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Test Failed: Request error:', error);
});

req.write(payload);
req.end();
