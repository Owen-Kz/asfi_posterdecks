const { configDotenv } = require('dotenv');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const client = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API;

const sendEmail = async (useremail, name, meetingID, posterTitle, posterDeckId) => {
    const currentYear = new Date().getFullYear();
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    try {
        async function SendMain(email) {
            const response = await apiInstance.sendTransacEmail(email);
            console.log("Brevo Response:", response);
        }

        const messageHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Poster Submission Successful - ASFIScholar</title>
    <style>
        /* Reset styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .header {
            background: linear-gradient(135deg, #7e22ce 0%, #a855f7 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 26px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .logo-subtitle {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
        }
        
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        
        .highlight-box {
            background: #f8fafc;
            border-left: 4px solid #7e22ce;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .poster-title {
            font-size: 18px;
            font-weight: 600;
            color: #7e22ce;
            margin-bottom: 8px;
        }
        
        .poster-details {
            color: #6b7280;
            font-size: 14px;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #7e22ce 0%, #a855f7 100%);
            color: white;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 25px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(126, 34, 206, 0.2);
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 8px -1px rgba(126, 34, 206, 0.3);
        }
        
        .link-text {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 6px;
            font-family: monospace;
            font-size: 14px;
            color: #475569;
            word-break: break-all;
            margin: 20px 0;
            border: 1px solid #e2e8f0;
        }
        
        .divider {
            height: 1px;
            background: #e2e8f0;
            margin: 30px 0;
        }
        
        .footer {
            padding: 30px;
            background: #f8fafc;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
        
        .social-links {
            margin: 20px 0;
        }
        
        .social-link {
            display: inline-block;
            margin: 0 10px;
            color: #7e22ce;
            text-decoration: none;
            font-weight: 500;
        }
        
        .contact-info {
            margin-top: 15px;
            font-size: 13px;
            color: #9ca3af;
        }
        
        /* Responsive design */
        @media only screen and (max-width: 600px) {
            .header {
                padding: 30px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .greeting {
                font-size: 16px;
            }
            
            .cta-button {
                display: block;
                margin: 20px 0;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">ASFIScholar</div>
            <div class="logo-subtitle">African Science Frontiers Initiatives</div>
        </div>
        
        <!-- Content -->
        <div class="content">
            <h1 class="greeting">Hello, ${name}!</h1>
            
            <p class="message">
                Great news! Your poster submission has been successfully processed and is now live on our platform.
            </p>
            
            <div class="highlight-box">
                <div class="poster-title">${posterTitle}</div>
                <div class="poster-details">Meeting: ${meetingID}</div>
            </div>
            
            <p class="message">
                Your research is now accessible to the ASFIScholar community. You can view your poster using the link below:
            </p>
            
            <div style="text-align: center;">
                <a href="https://posters.asfischolar.com/event/poster/${posterDeckId}" class="cta-button">
                    View Your Poster
                </a>
            </div>
            
            <p class="message">
                Or copy and paste this URL into your browser:
            </p>
            
            <div class="link-text">
                https://posters.asfischolar.com/event/poster/${posterDeckId}
            </div>
            
            <div class="divider"></div>
            
            <p class="message" style="font-size: 14px; color: #6b7280;">
                <strong>What's next?</strong><br>
                • Share your poster with colleagues<br>
                • Engage with feedback from the community<br>
                • Explore other research on our platform
            </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="social-links">
                <a href="https://asfischolar.net" class="social-link">Website</a>
                <a href="https://asfischolar.net/#faq" class="social-link">Help Center</a>
                <a href="https://asfischolar.org/contact" class="social-link">Contact Support</a>
            </div>
            
            <div class="contact-info">
                ASFIScholar &copy; ${currentYear} - Empowering African Research
            </div>
            
            <div class="contact-info" style="margin-top: 8px;">
                This is an automated message. Please do not reply to this email.
            </div>
        </div>
    </div>
</body>
</html>
        `;

        const email = {
            to: [{ email: useremail, name: name }],
            sender: { email: 'no-reply@asfischolar.net', name: 'ASFIScholar' },
            subject: "🎉 Your Poster Has Been Successfully Published!",
            htmlContent: messageHtml
        };
        
        await SendMain(email);

    } catch (error) {
        console.log("Error sending email:", error);
        return { error: error.message };
    }
};

module.exports = sendEmail;