const { UpdatePosterDecks } = require("../routes/queries");

async function EditDeck(req, res, pdfUrl, presenterUrl, previewUrl) {
    try {
        console.log("📝 EditDeck called with Cloudinary URLs:");
        console.log("PDF URL:", pdfUrl);
        console.log("Presenter URL:", presenterUrl);
        console.log("Preview URL:", previewUrl);
        
        // Update the function call to pass Cloudinary URLs instead of local filenames
        const TableData = await UpdatePosterDecks(req, res, pdfUrl, presenterUrl, previewUrl);
        
        console.log("✅ EditDeck completed successfully");
        return { success: true, message: "Poster Updated Successfully" };
       
    } catch (error) {
        console.error("❌ Error in EditDeck:", error.message);
        return { 
            success: false, 
            error: "Internal Server Error: " + error.message,
            page: "/editPoster"
        };
    }
}

module.exports = EditDeck;