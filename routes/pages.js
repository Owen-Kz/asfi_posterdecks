const express = require("express");
const fetchDataFromTable = require("../controllers/PosterDecksResult");
const posterDeckTable = require("../controllers/posterDeckTable");
const CreateDeck = require("../controllers/createPosterDeck");
const router = express.Router();
const multer = require('multer');
router.use(express.json())
const bodyParser = require("body-parser");
const path = require("path");
const PosterDeckPreviews = require("../controllers/previewDeck");
const { RetrievePosterDecksTableForAdmin, validateIdNumber, LikePoster, DisLikePoster, ViewPoster } = require("./queries");
const ScreenCapture = require("../puppetter");
const setValue = require("../zetValues");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.urlencoded({ extended: true }));



router.get("/", (req,res) =>{
  res.redirect("/uploadPoster")
})
router.get("/posteradmin", async(req,res) =>{
  console.log("trent")
const PosterAdmin = await RetrievePosterDecksTableForAdmin(req,res)
res.json({PosterDecks:JSON.stringify(PosterAdmin)})
})
router.get("/posterlist/:meetingID",(req,res)=>{
  const meetingID = req.params.meetingID
  res.render("posterDeckList", {meetingID:meetingID})
})
router.get('/getposterdecks/:meetingId', async(req,res) =>{
    const meetingId = req.params.meetingId
    await posterDeckTable(req,res, meetingId)
})
 
router.get("/AvailableChannels", (req,res) =>{
    res.render("AllChannels")
})
router.get("/allchannels",async (req, res) => {
    await fetchDataFromTable(req, res);
})


const uploadPath = path.join(__dirname, '../public/useruploads/');
const uploadImage = path.join(__dirname, '../public/useruploads/Images/');

const storagen = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);  // Destination folder for PDF files
  },
  filename: function (req, file, cb) {
    // Rename the file here
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, 'PosterPDF-' + uniqueSuffix + fileExtension);
  }
});

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
    cb(null, file.fieldname + '-' + uniqueSuffix + (file.fieldname === 'PosterPDF' ? '.pdf' : fileExtension ));
  },
});



const upload = multer({ storage });

router.post("/createdeck", upload.fields([{ name: 'PosterPDF', maxCount: 1 }, { name: 'PresenterPic', maxCount: 1 }]), async (req, res) => {
  const pdfFiles = req.files['PosterPDF'][0].filename;
  const imageFiles = req.files['PresenterPic'][0].filename;
  // Now you can use newFileName and profileImage in your CreateDeck function
  await CreateDeck(req, res, pdfFiles, imageFiles);
});


// validate poster Id numbers 
router.get("/validateKey/:key", async(req,res)=>{
  const key = req.params.key
  validateIdNumber(req,res,key)
})
router.get("/poster", async (req,res)=>{
    res.render("poster")
})
router.get("/event/poster/:posterDeckLink", async(req,res)=>{
    
    await PosterDeckPreviews(req,res)
})

// like a poster 
router.get("/likeposter/:posterId/:currentCount", async (req,res)=>{
  const posterId = req.params.posterId
  const currentCount = req.params.currentCount
  
  await LikePoster(req,res,posterId, currentCount)
  res.json({message:"liked"})
})

// Dislike poster 
router.get("/dislikeposter/:posterId/:currentCount", async (req,res)=>{
  const posterId = req.params.posterId
  const currentCount = req.params.currentCount
  await DisLikePoster(req,res,posterId, currentCount)
  res.json({message:"disliked"})
})

// View Poster 
// Dislike poster 
router.get("/viewposter/:posterId/:currentCount", async (req,res)=>{
  const posterId = req.params.posterId
  const currentCount = req.params.currentCount
  console.log(posterId, currentCount)

  await ViewPoster(req,res,posterId, currentCount)
  res.json({message:"viewed"})
})

router.get("/sessionDashboard", async(req,res)=>{
    res.render("sessionDashboard")
})
router.get("/uploadPoster", async(req,res)=>{
    res.render("uploadPoster")
})

router.get("/record", (req,res)=>{
  res.render("recorderTest")
})


router.get("*", (req,res)=>{
  res.render("error", {status:"Page Not Found", page:"/"})
})



module.exports = router; 