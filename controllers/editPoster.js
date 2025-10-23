const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { UploadFiles } = require("../routes/dbQueries");
const EditDeck = require("./editPosterDeck");

// Configure Cloudinary (make sure to set your environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });
const cleanTitle = (title) => title.replace(/[^a-zA-Z0-9]/g, "");

// 🔹 Enhanced Cloudinary Upload Helper with better error handling
const uploadToCloudinaryWithRetry = (buffer, options = {}, retries = 3) => {
  return new Promise((resolve, reject) => {
    const attemptUpload = (attemptsLeft) => {
      console.log(`Cloudinary upload attempt ${4 - attemptsLeft}/3...`);
      
      const uploadStream = cloudinary.uploader.upload_stream(
        { ...options, timeout: 30000 },
        (error, result) => {
          if (error) {
            console.error(`❌ Cloudinary upload error (${attemptsLeft} retries left):`, error.message);
            
            if (attemptsLeft > 0) {
              // Wait 1 second before retrying
              setTimeout(() => attemptUpload(attemptsLeft - 1), 1000);
            } else {
              reject(new Error(`Cloudinary upload failed after 3 attempts: ${error.message}`));
            }
          } else {
            console.log("✅ Cloudinary upload successful");
            resolve(result);
          }
        }
      );

      // Handle stream errors
      uploadStream.on('error', (streamError) => {
        console.error('Stream error:', streamError);
        if (attemptsLeft > 0) {
          setTimeout(() => attemptUpload(attemptsLeft - 1), 1000);
        } else {
          reject(new Error(`Stream error after 3 attempts: ${streamError.message}`));
        }
      });

      // Pipe the buffer to Cloudinary
      streamifier.createReadStream(buffer).pipe(uploadStream);
    };

    attemptUpload(retries);
  });
};

// 🔹 Alternative: Direct upload without streams (more reliable)
const directUploadToCloudinary = async (buffer, options = {}, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Direct Cloudinary upload attempt ${attempt}/${retries}...`);
      
      // Convert buffer to base64 for direct upload
      const base64Data = buffer.toString('base64');
      const dataUri = `data:application/pdf;base64,${base64Data}`;
      
      const result = await cloudinary.uploader.upload(dataUri, {
        ...options,
        timeout: 30000
      });
      
      console.log("✅ Direct Cloudinary upload successful");
      return result;
    } catch (error) {
      console.error(`❌ Direct upload attempt ${attempt} failed:`, error.message);
      
      if (attempt === retries) {
        throw new Error(`Cloudinary upload failed after ${retries} attempts: ${error.message}`);
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// Define the middleware for editing deck
const editDeck = async (req, res) => {
  try {
    const pdfFile = req.files.PosterPDF ? req.files.PosterPDF[0] : null;
    const imageFile = req.files.PresenterPic ? req.files.PresenterPic[0] : null;

    // Check if the PDF file exists
    if (!pdfFile) {
      return res.status(400).render("error", {
        status: "PDF file is required for editing.",
        page: "/editPoster"
      });
    }

    console.log("Starting file upload process for edit...");

    let pdfUrl, presenterUrl = null, previewUrl = null;

    // 🧠 Upload PDF to Cloudinary
    try {
      console.log("Uploading PDF to Cloudinary...");
      const pdfResult = await directUploadToCloudinary(pdfFile.buffer, {
        folder: "poster_pdfs",
        public_id: cleanTitle(pdfFile.originalname.split(".")[0]),
        resource_type: "raw",
      });
      pdfUrl = pdfResult.secure_url;
      console.log("✅ PDF uploaded to Cloudinary:", pdfUrl);
    } catch (pdfError) {
      console.error("PDF upload failed, trying stream method...");
      const pdfResult = await uploadToCloudinaryWithRetry(pdfFile.buffer, {
        folder: "poster_pdfs",
        public_id: cleanTitle(pdfFile.originalname.split(".")[0]),
        resource_type: "raw",
      });
      pdfUrl = pdfResult.secure_url;
      console.log("✅ PDF uploaded via stream method:", pdfUrl);
    }

    // 🧠 Upload Presenter Picture (if provided)
    if (imageFile) {
      try {
        console.log("Uploading presenter image to Cloudinary...");
        const presenterResult = await directUploadToCloudinary(imageFile.buffer, {
          folder: "presenter_pics",
          resource_type: "image",
          public_id: cleanTitle(imageFile.originalname.split(".")[0]),
        });
        presenterUrl = presenterResult.secure_url;
        console.log("✅ Presenter image uploaded:", presenterUrl);
      } catch (error) {
        console.warn("Presenter image upload failed, continuing without it:", error.message);
        // Use default avatar if upload fails
        presenterUrl = "avatar.jpg";
      }
    } else {
      // Use default avatar if no image provided
      presenterUrl = "avatar.jpg";
    }

    // 🧠 Generate PDF Preview
    try {
      console.log("Generating PDF preview...");
      
      const pdfUploadResult = await directUploadToCloudinary(pdfFile.buffer, {
        folder: "pdf_previews",
        resource_type: "raw",
        public_id: `preview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      });
      
      const pdfPublicId = pdfUploadResult.public_id;
      const imagePublicId = pdfPublicId.replace('.pdf', '');
      
      // Construct the image preview URL
      previewUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/q_auto:good,f_jpg,pg_1/${imagePublicId}.jpg`;
      
      console.log("✅ PDF preview URL:", previewUrl);
      
    } catch (previewError) {
      console.warn("⚠️ Preview generation failed:", previewError.message);
      previewUrl = null;
    }

    // 🧠 Save to database
    console.log("Saving to database...");
    const query = `INSERT INTO files (filename, file_link, is_link) VALUES (?, ?, true)`;
    const values = [pdfFile.originalname, pdfUrl];
    await UploadFiles(query, values);
    console.log("✅ Database save complete");

    // 🧠 Update Deck - Call the EditDeck function with Cloudinary URLs
    console.log("Updating deck...");
    const deckResult = await EditDeck(req, res, pdfUrl, presenterUrl, previewUrl);

    // 🧠 Unified Response Handling
    if (deckResult.success) {
      console.log("🎉 Deck update completed successfully");
      res.render("success", {
        status: deckResult.message,
        page: "/sessionDashboard"
      });
    } else {
      console.error("❌ Deck update failed:", deckResult.error);
      res.render("error", {
        status: deckResult.error,
        page: deckResult.page || "/editPoster"
      });
    }

  } catch (error) {
    console.error("❌ Fatal error in editDeck:", error);
    return res.render("error", {
      status: "Failed to update deck: " + error.message,
      page: "/editPoster"
    });
  }
};
// Export the upload middleware and the editDeck function
module.exports = {
  uploadFields: upload.fields([
    { name: 'PosterPDF', maxCount: 1 },
    { name: 'PresenterPic', maxCount: 1 }
  ]),
  editDeck
};