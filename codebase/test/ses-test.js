const https = require('https');

// Configuration
const API_ENDPOINT = 'https://kbdo8y8o11.execute-api.us-east-1.amazonaws.com';
const TEST_EMAIL = 'success@simulator.amazonses.com'; // AWS SES Simulator Success Email

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
