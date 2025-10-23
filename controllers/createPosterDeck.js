const { InsertIntoPosterDecks } = require("../routes/queries");
async function CreateDeck(req, newFileName, ImageFile, previewImageUrl) {
    try {
        const result = await InsertIntoPosterDecks(req, newFileName, ImageFile, previewImageUrl);
        return result;
    } catch (error) {
        console.error("Error in CreateDeck:", error.message);
        return { 
            success: false, 
            error: "Internal Server Error",
            page: "/sessionDashboard"
        };
    }
}

module.exports = CreateDeck;