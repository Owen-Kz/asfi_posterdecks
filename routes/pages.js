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
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.urlencoded({ extended: true }));



router.get("/", (req,res) =>{
  res.redirect("/uploadPoster")
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
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);  // Destination folder
  },
  filename: function (req, file, cb) {
    // Rename the file here
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  }
});

const upload = multer({ storage });

router.post("/createdeck", upload.single('PosterPDF'), async (req, res) => {
  const newFileName = req.file.filename;
  await CreateDeck(req, res, newFileName);
});


router.get("/poster", async (req,res)=>{
    res.render("poster")
})
router.get("/event/poster/:posterDeckLink", async(req,res)=>{
    
    await PosterDeckPreviews(req,res)
})
// router.get("/previewPosters", async (req,res) =>{
//     res.render("previewPoster")
// })

router.get("/sessionDashboard", async(req,res)=>{
    res.render("sessionDashboard")
})
router.get("/uploadPoster", async(req,res)=>{
    res.render("uploadPoster")
})

router.get("/record", (req,res)=>{
  res.render("recorderTest")
})

router.get("/*", (req,res)=>{
  res.render("error", {status:"Page Not Found", page:"/"})
})




module.exports = router; 