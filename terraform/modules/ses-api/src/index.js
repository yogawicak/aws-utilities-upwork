const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const client = new SESClient();

exports.handler = async (event) => {
  console.log("Event:", JSON.stringify(event));
  
  try {
    const body = JSON.parse(event.body || "{}");
    const { to, subject, text, html } = body;

    if (!to || !subject || (!text && !html)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields: to, subject, and (text or html)" }),
      };
    }

    const input = {
      Source: process.env.SES_EMAIL,
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: text || "",
          },
          Html: {
            Data: html || "",
          },
        },
      },
    };

    const command = new SendEmailCommand(input);
    const response = await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent", messageId: response.MessageId }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};
