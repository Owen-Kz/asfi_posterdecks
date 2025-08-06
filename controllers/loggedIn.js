const { config } = require("dotenv")

config()
const loggedIn = async (req, res, next) => {
    const maxRetries = 3; // 1 initial try + 2 retries
    const token = req.cookies.posterUser;

    if (!token) {
        return res.render("loginExternal");
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(`${process.env.ASFISCHOLAR_ENDPOINT}/external/api/validateLogin`, {
                method: "POST",
                body: JSON.stringify({ token }),
                headers: {
                    "Content-type": "application/json"
                }
            });

            const data = await response.json();

            if (data.userInfo) {
                req.user = data.userInfo;
                return next();
            } else {
                console.log(data.error);
                return res.render("loginExternal");
            }

        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error.message);

            if (attempt === maxRetries) {
                return res.json({
                    error: error.message,
                    message: "Could not establish connection with server"
                });
            }

            // Small delay before retrying (optional)
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
};

module.exports = loggedIn;
