const { configDotenv } = require('dotenv');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const client = SibApiV3Sdk.ApiClient.instance;


// Configure API key authorization
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API;

const sendEmail = async (useremail, name, meetingID, posterTitle,posterDeckId) => {
    const currentYear = new Date().getFullYear();
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


        try {
            async function SendMain(email) {
                const response = await apiInstance.sendTransacEmail(email);
                console.log("Brevo Response:", response);
            }
            const messageHtml = `
            <p>Dear, ${name}</p>
            <p>Your poster "${posterTitle}" has been succesfully submitted</p>
            <p>Click <a href="https://posters.asfischolar.com/event/poster/${posterDeckId}">here</a> to view the submission or paste this link in your browser. https://posters.asfischolar.com/event/poster/${posterDeckId} </p>
            `
    
                const email = {
                    to: [{ email: useremail }],
                    sender: { email: 'no-reply@asfischolar.net', name: 'ASFI Scholar' },
                    subject:"ASFI Poster upload successful",
                    htmlContent: `<html><body>${messageHtml}
                                  <p>${currentYear} (c) Asfischolar.net</p></body></html>`
                };
                await SendMain(email);
            


        } catch (error) {
            console.log("Error sending email:", error);
            return res.json({ error: error.message });
        }

};

module.exports = sendEmail;
