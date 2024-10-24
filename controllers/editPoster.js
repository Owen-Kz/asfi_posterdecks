const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { UploadFiles } = require("../routes/dbQueries");
const EditDeck = require("./editPosterDeck");

const uploadPath = path.join(__dirname, '../public/useruploads/');
const uploadImage = path.join(__dirname, '../public/useruploads/images/');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'PosterPDF') {
      cb(null, uploadPath); // Destination folder for PDFs
    } else if (file.fieldname === 'PresenterPic') {
      cb(null, uploadImage); // Destination folder for images
    }
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + (file.fieldname === 'PosterPDF' ? '.pdf' : fileExtension));
  },
});

const upload = multer({ storage });

// Define the middleware for editing deck
const editDeck = async (req, res) => {
    try{
  const pdfFile = req.files.PosterPDF ? req.files.PosterPDF[0] : null; // Get the PDF file object
  const imageFile = req.files.PresenterPic ? req.files.PresenterPic[0] : null; // Get the image file object

  // Check if the PDF file exists
  if (!pdfFile) {
    return console.log('PDF file is missing.');
  }

  // Read the uploaded file into a buffer
  const buffer = fs.readFileSync(pdfFile.path);
  // const imageBuffer = imageFile ? fs.readFileSync(imageFile.path) : null;

  const query = `INSERT INTO files (filename, filedata) VALUES (?, ?)`;
  const values = [pdfFile.filename, buffer];

  // await executeQuery(query, values);
  await UploadFiles(query, values);
  
  // if (imageFile) {
  //   const imageQuery = `INSERT INTO files (filename, filedata) VALUES (?, ?)`;
  //   const imageValues = [imageFile.filename, imageBuffer];
  //   await UploadFiles(imageQuery, imageValues);
  // }

  console.log("File uploaded to PostgreSQL successfully");
  await EditDeck(req, res, pdfFile.filename, "avatar.jpg");


  // Delete the local PDF file
  fs.unlink(pdfFile.path, (unlinkErr) => {
    if (unlinkErr) {
      console.error('Error deleting local PDF file:', unlinkErr);
    } else {
      console.log('Local PDF file deleted successfully.');
    }
  });
  res.render("success", {status:"Poster Edited Succesfully", page:"/sessionDashboard"})
}catch(error){
    return res.render("error", {status:error.message})
}
};

// Export the upload middleware and the editDeck function
module.exports = {
  uploadFields: upload.fields([{ name: 'PosterPDF', maxCount: 1 }, { name: 'PresenterPic', maxCount: 1 }]),
  editDeck
};
