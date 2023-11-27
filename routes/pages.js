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
const { RetrievePosterDecksTableForAdmin, validateIdNumber, LikePoster, DisLikePoster, ViewPoster, DownloadCount, CreateQuestion, CreateOptions, FindQuestion, FindOption, VotePoll, CheckVoted, CreateVoter } = require("./queries");
const ScreenCapture = require("../puppetter");
const setValue = require("../zetValues");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.urlencoded({ extended: true }));
const fs = require("fs")
const os = require('os');

// Get the system's hostname
const hostname = os.hostname();


// Get the system's IP addresses
// const networkInterfaces = os.networkInterfaces();
// const ipAddresses = {};

// Object.keys(networkInterfaces).forEach(interfaceName => {
//   const interfaces = networkInterfaces[interfaceName];
//   interfaces.forEach(interfaceDetails => {
//     if (interfaceDetails.family === 'IPv4') {
//       ipAddresses[interfaceName] = interfaceDetails.address;
//     }
//   });
// });

// console.log('IP Addresses:', ipAddresses);


// Object.keys(networkInterfaces).forEach(interfaceName => {
//   const interfaces = networkInterfaces[interfaceName];
//   interfaces.forEach(interfaceDetails => {
//     if (interfaceDetails.mac && interfaceDetails.family === 'IPv4') {
//       console.log(`Interface: ${interfaceName}, MAC Address: ${interfaceDetails.mac}`);
//     }
//   });
// });

router.get("/", (req,res) =>{
  res.redirect("https://asfischolar.org")
})
// For Posters 
router.get("/posters", (req,res) =>{
  res.redirect("/uploadPoster")
})
router.get("/posteradmin", async(req,res) =>{

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


const Storage = require('megajs');
const { executeQuery, UploadFiles } = require("./dbQueries");

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
    cb(null, file.fieldname + '-' + uniqueSuffix + (file.fieldname === 'PosterPDF' ? '.pdf' : fileExtension ));
  },
});


const upload = multer({ storage });

router.post("/createdeck", upload.fields([{ name: 'PosterPDF', maxCount: 1 }, { name: 'PresenterPic', maxCount: 1 }]), async (req, res) => {
  const pdfFile = req.files.PosterPDF[0]; // Get the PDF file object
  const imageFile = req.files.PresenterPic[0]; // Get the image file object

  // Check if both files exist
  if (!pdfFile || !imageFile) {
    return console.log('PDF file or image file is missing.');
  }
  // Read the uploaded file into a buffer
  const buffer = fs.readFileSync(pdfFile.path);
  const imageBuffer = fs.readFileSync(imageFile.path)

  const query = `INSERT INTO files (filename, filedata) VALUES ($1, $2)`;
  const values = [pdfFile.filename, buffer];

  const imageValues = [imageFile.filename, imageBuffer]

  // await executeQuery(query, values)
 await UploadFiles(query, values)
  await UploadFiles(query, imageValues)

  console.log("File uploaded to postgress successfully")
 await CreateDeck(req, res, pdfFile.filename, imageFile.filename);

  // if(PdfBufferUploaded && ImageBufferUploaded && PosterDeckUploaded){
      fs.unlink(pdfFile.path, (unlinkErr) => {
    if (unlinkErr) {
      console.error('Error deleting local PDF file:', unlinkErr);
    } else {
      console.log('Local PDF file deleted successfully.');
    }
  });  
  fs.unlink(imageFile.path, (unlinkErr) => {
    if (unlinkErr) {
      console.error('Error deleting local PDF file:', unlinkErr);
    } else {
      console.log('Local PDF file deleted successfully.');
    }
  });
  // }

  
});

router.get("/fetchFiles", (req,res)=>{
  res.render("tempFilePreview")
})

router.get("/files/uploaded/posterpdf/:filename", async (req, res) => {
  const fileName = req.params.filename;

  const query = 'SELECT * FROM files WHERE filename = $1';
  const values = [fileName];

  try {
    const result = await UploadFiles(query, values);
    const fileData = result[0].filedata;

    // Set appropriate headers for the response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.end(fileData); // Send the file data as the response
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).send('Error retrieving file');
  }
});

router.get("/files/uploaded/presenterImage/:filename", async (req, res) => {
  const fileName = req.params.filename;

  const query = 'SELECT * FROM files WHERE filename = $1';
  const values = [fileName];

  try {
    const result = await UploadFiles(query, values);
    const fileData = result[0].filedata;

    // Set appropriate headers for the response
    res.setHeader('Content-Type', 'image/*');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.end(fileData); // Send the file data as the response
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).send('Error retrieving file');
  }
});



// validate poster Id numbers 
router.get("/validateKey/:key", async(req,res)=>{
  const key = req.params.key
  validateIdNumber(req,res,key)
})
router.get("/poster", async (req,res)=>{
    // res.render("poster")
    res.redirect("/")
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
// DOWNLOAD POSTER COUNT
router.get("/downloadpostercount/:posterId/:currentCount", async (req,res)=>{
  const PosterID = req.params.posterId
  const CurrentCount = req.params.currentCount
  await DownloadCount(req,res, PosterID, CurrentCount)
  res.json({message:"downloaded"})
})


// View Poster 
// Dislike poster 
router.get("/viewposter/:posterId/:currentCount", async (req,res)=>{
  const posterId = req.params.posterId
  const currentCount = req.params.currentCount

  await ViewPoster(req,res,posterId, currentCount)
  res.json({message:"viewed"})
})

router.get("/sessionDashboard", async(req,res)=>{
    res.render("sessionDashboard")
})
router.get("/uploadPoster", async(req,res)=>{
    res.render("uploadPoster")
})

// POLLS 
router.get("/polls/:meetingID", (req,res)=>{
  const meetingId = req.params.meetingID
  res.render("polls", {meetingId:meetingId, hostName: hostname})
})
router.get('/polls/create/new',(req,res)=>{
  res.render("createPoll")
})
router.post('/polls/create/new', async (req,res)=>{

  function getRandomString() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var passwordLength = 15;
    var bufferID = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        bufferID += chars.substring(randomNumber, randomNumber + 1);
    }
    return bufferID
}
const buffer = getRandomString()
let CountQuery = 0
  const {meetingId, question, options} = req.body
  async function CreateOptionsFunction(){
    options.forEach(option =>{
      console.log(option)
    const OptionId =  getRandomString()
    CreateOptions(buffer, option, OptionId)
    CountQuery++
  })
  }

  await CreateQuestion(buffer, question, meetingId)
  await CreateOptionsFunction()
  res.json({message:'Poll Created'})

})
router.get("/polls/poll/question/:meetingId", async(req,res) =>{
  const MeetingId = req.params.meetingId
  const result = await FindQuestion(MeetingId)
  res.json({question:JSON.stringify(result)}) 
})
router.get("/polls/poll/question/options/:questionID", async(req,res)=>{
  const QuestionId = req.params.questionID
  const result = await FindOption(QuestionId)
  res.json({options:JSON.stringify(result)})
})

router.get("/polls/increasePollsCount/:optionId/:pollCounts/:hostName/:pollId", async (req,res) =>{
  const OptionsId = req.params.optionId
  const pollsCounts = req.params.pollCounts
  const HostName = req.params.hostName
  const poll_id = req.params.pollId

  const VetVote = await CheckVoted(HostName, poll_id)
  if(VetVote.length > 0){
    res.json({message:"Voted"})
  }else{
    await CreateVoter(HostName, poll_id)
    await VotePoll(OptionsId)
    res.json({message: "Voted successfully"})
  }

})
// END POLLS 

router.get("/record", (req,res)=>{
  res.render("recorderTest")
})
  

// End Posters

router.get("*", (req,res)=>{
  res.render("error", {status:"Page Not Found", page:"/"})
})



module.exports = router; 