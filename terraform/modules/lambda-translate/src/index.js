const AWS = require('aws-sdk')
const translate = new AWS.Translate();

exports.handler = async (event) => {
    console.log("Event:", JSON.stringify(event));

    try {
        const { text, sourceLanguageCode, targetLanguageCode } = event;

        if (!text || !sourceLanguageCode || !targetLanguageCode) {
            throw new Error("Missing required parameters: text, sourceLanguageCode, targetLanguageCode");
        }

        const params = {
            Text: text,
            SourceLanguageCode: sourceLanguageCode,
            TargetLanguageCode: targetLanguageCode
        };

        const result = await translate.translateText(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                translatedText: result.TranslatedText,
                sourceLanguageCode: result.SourceLanguageCode,
                targetLanguageCode: result.TargetLanguageCode
            })
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message
            })
        };
    }
};
