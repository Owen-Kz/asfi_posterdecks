const express = require("express");
const fetchDataFromTable = require("../controllers/PosterDecksResult");
const posterDeckTable = require("../controllers/posterDeckTable");
const CreateDeck = require("../controllers/createPosterDeck");
const router = express.Router();
const multer = require('multer');
const bodyParser = require("body-parser");
const path = require("path");
const PosterDeckPreviews = require("../controllers/previewDeck");
const { RetrievePosterDecksTableForAdmin, validateIdNumber, LikePoster, DisLikePoster, ViewPoster, DownloadCount, CreateQuestion, CreateOptions, FindQuestion, FindOption, VotePoll, CheckVoted, CreateVoter, SelectMeetings, TotalMeetingsCount, DeleteChannel, SelectPosters, TotalPostersCount, DeletePoster, GetMeetingName, GetTotalRatings, GetAllRatings, CheckIfRatingExists, RetrievePosterDecksTable } = require("./queries");
const ScreenCapture = require("../puppetter");
const setValue = require("../zetValues");
const Storage = require('megajs');
const { executeQuery, UploadFiles } = require("./dbQueries");
const GraphChannels = require("../controllers/graphChannels");
const waitingRoom = require("../controllers/waitingRoom");
const loginPage = require("../controllers/loginPage");
const login = require("../controllers/login");
const loggedIn = require("../controllers/loggedIn");
const generatePosterId = require("../controllers/generatePosterID");
const ChatPresenterPage = require("../controllers/chatPresenter");
const sessionDashboard = require("../controllers/sessionDashboard");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.urlencoded({ extended: true }));
router.use(express.json())

const fs = require("fs")
const os = require('os');
const uploadPosterPage = require("../controllers/pages/uploadPosterPage");
const deletePoster = require("../controllers/deletePoster");
const editPosterPage = require("../controllers/pages/editPosterPage");
const { uploadFields, editDeck } = require("../controllers/editPoster");
const saveRatingToDB = require("../controllers/saveRating");
const { createCanvas } = require('canvas');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
pdfjsLib.GlobalWorkerOptions.workerSrc =
  require('pdfjs-dist/build/pdf.worker.js');

const cloudinary = require('cloudinary');

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
// Enable CORS for this router
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  next();
});

router.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.sendStatus(200);
});


router.get("/", (req, res) => {
  res.redirect("/login")
})
// For Posters 
router.get("/posters", (req, res) => {
  res.redirect("/uploadPoster")
})
router.get("/posteradmin", loggedIn, async (req, res) => {
  if (req.user) {
    const Email = req.user.email
    const PosterAdmin = await RetrievePosterDecksTableForAdmin(req, res, Email)
    res.json({ PosterDecks: JSON.stringify(PosterAdmin) })
  } else {
    res.json({ PosterDecks: "[]" })
  }
})


router.get("/posterlist/:meetingID", (req, res) => {
  const meetingID = req.params.meetingID
  res.render("posterDeckList", { meetingID: meetingID })
})
router.get('/getposterdecks/:meetingId', async (req, res) => {
  const meetingId = req.params.meetingId
  // await posterDeckTable(req,res, meetingId)
  await RetrievePosterDecksTable(req, res, meetingId)
})

router.get("/AvailableChannels", (req, res) => {
  res.render("AllChannels")
})
router.get("/allchannels", async (req, res) => {
  await fetchDataFromTable(req, res);
})



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

router.post("/createdeck", upload.fields([
  { name: 'PosterPDF', maxCount: 1 },
  { name: 'PresenterPic', maxCount: 1 }
]), async (req, res) => {
  try {
    const pdfFile = req.files.PosterPDF?.[0];
    if (!pdfFile) {
      return res.status(400).json({ error: 'PDF file is missing.' });
    }

    // 1️⃣ Save PDF buffer to database
    const buffer = fs.readFileSync(pdfFile.path);
    const query = `INSERT INTO files (filename, filedata) VALUES (?, ?)`;
    const values = [pdfFile.filename, buffer];
    await UploadFiles(query, values);

    console.log("PDF file saved to Postgres");

    // Helper function: upload with retry
    const uploadToCloudinary = (imageBuffer, retries = 2) => {
      return new Promise((resolve, reject) => {
        const attempt = (remaining) => {
          console.log(`Uploading to Cloudinary... attempts left: ${remaining}`);
          const stream = cloudinary.v2.uploader.upload_stream(
            { folder: "pdf_previews", resource_type: "image", timeout: 60000 },
            (err, result) => {
              if (err) {
                console.error("Cloudinary upload error:", err.message);
                if (remaining > 0) {
                  console.log("Retrying upload...");
                  attempt(remaining - 1);
                } else {
                  reject(err);
                }
              } else {
                resolve(result.secure_url);
              }
            }
          );
          stream.end(imageBuffer);
        };
        attempt(retries);
      });
    };

    // 2️⃣ Generate preview image from first PDF page
    let previewUrl = null;
    try {
      const pdfData = new Uint8Array(buffer);
      const pdfDoc = await pdfjsLib.getDocument({
        data: pdfData,
        disableFontFace: true
      }).promise;
      const firstPage = await pdfDoc.getPage(1);

      const viewport = firstPage.getViewport({ scale: 1.0 }); // Slightly smaller scale
      const canvas = createCanvas(viewport.width, viewport.height);
      const ctx = canvas.getContext("2d");

      await firstPage.render({ canvasContext: ctx, viewport }).promise;

      const imageBuffer = canvas.toBuffer("image/jpeg", { quality: 0.7 }); // Compressed JPG

      // 3️⃣ Upload preview image to Cloudinary with retry
      previewUrl = await uploadToCloudinary(imageBuffer, 2); // 2 retries

      console.log("Preview uploaded to Cloudinary:", previewUrl);

    } catch (err) {
      console.error("Failed to generate PDF preview:", err);
      // Continue without preview
    }

    // 4️⃣ Create Deck record
    await CreateDeck(req, res, pdfFile.filename, "avatar.jpg", previewUrl);

    // 5️⃣ Delete temp PDF file
    fs.unlink(pdfFile.path, (unlinkErr) => {
      if (unlinkErr) console.error("Error deleting temp PDF:", unlinkErr);
      else console.log("Temp PDF deleted");
    });

  } catch (err) {
    console.error("Error in /createdeck:", err);
    res.status(500).json({ error: "Failed to create deck" });
  }
});



router.get("/fetchFiles", (req, res) => {
  res.render("tempFilePreview")
})

router.get("/files/uploaded/posterpdf/:filename", async (req, res) => {
  const fileName = req.params.filename;

  const query = 'SELECT * FROM files WHERE filename = ?';
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

  const query = 'SELECT * FROM files WHERE filename = ?';
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
router.get("/validateKey/:key", async (req, res) => {
  const key = req.params.key
  validateIdNumber(req, res, key)
})
router.get("/poster", async (req, res) => {
  // res.render("poster")
  res.redirect("/")
})
router.get("/event/poster/:posterDeckLink", loggedIn, async (req, res) => {
  await PosterDeckPreviews(req, res)
})



// like a poster 
router.get("/likeposter/:posterId/:currentCount", loggedIn, async (req, res) => {
  const posterId = req.params.posterId
  const currentCount = req.params.currentCount
  await LikePoster(req, res, posterId, currentCount)
  res.json({ message: "liked" })
})

// Dislike poster 
router.get("/dislikeposter/:posterId/:currentCount", loggedIn, async (req, res) => {
  const posterId = req.params.posterId
  const currentCount = req.params.currentCount
  await DisLikePoster(req, res, posterId, currentCount)
  res.json({ message: "disliked" })
})
// DOWNLOAD POSTER COUNT
router.get("/downloadpostercount/:posterId/:currentCount", loggedIn, async (req, res) => {
  const PosterID = req.params.posterId
  const CurrentCount = req.params.currentCount
  await DownloadCount(req, res, PosterID, CurrentCount)
  res.json({ message: "downloaded" })
})


// View Poster 
// Dislike poster 
router.get("/viewposter/:posterId/:currentCount", loggedIn, async (req, res) => {
  const posterId = req.params.posterId
  const currentCount = req.params.currentCount

  await ViewPoster(req, res, posterId, currentCount)
  res.json({ message: "viewed" })
})

router.get("/sessionDashboard", loggedIn, sessionDashboard)
router.get("/uploadPoster", loggedIn, uploadPosterPage)

// POLLS 
router.get("/polls/:meetingID", (req, res) => {
  const meetingId = req.params.meetingID
  res.render("polls", { meetingId: meetingId, hostName: hostname })
})
router.get('/polls/create/new', (req, res) => {
  res.render("createPoll")
})
router.post('/polls/create/new', async (req, res) => {

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
  const { meetingId, question, options } = req.body
  async function CreateOptionsFunction() {
    options.forEach(option => {
      console.log(option)
      const OptionId = getRandomString()
      CreateOptions(buffer, option, OptionId)
      CountQuery++
    })
  }

  await CreateQuestion(buffer, question, meetingId)
  await CreateOptionsFunction()
  res.json({ message: 'Poll Created' })

})
router.get("/polls/poll/question/:meetingId", async (req, res) => {
  const MeetingId = req.params.meetingId
  const result = await FindQuestion(MeetingId)
  res.json({ question: JSON.stringify(result) })
})
router.get("/polls/poll/question/options/:questionID", async (req, res) => {
  const QuestionId = req.params.questionID
  const result = await FindOption(QuestionId)
  res.json({ options: JSON.stringify(result) })
})

router.get("/polls/increasePollsCount/:optionId/:pollCounts/:hostName/:pollId", async (req, res) => {
  const OptionsId = req.params.optionId
  const pollsCounts = req.params.pollCounts
  const HostName = req.params.hostName
  const poll_id = req.params.pollId

  const VetVote = await CheckVoted(HostName, poll_id)
  if (VetVote.length > 0) {
    res.json({ message: "Voted" })
  } else {
    await CreateVoter(HostName, poll_id)
    await VotePoll(OptionsId)
    res.json({ message: "Voted successfully" })
  }

})
// END POLLS 

// APIs For External - ASFI Admin 
// GEt a LIST OF MEETINGS 
router.get("/admin/meetings/list", async (req, res) => {
  const page = req.query.page
  const itemsPerPage = 5; // Number of items to display per page
  const searchQuery = req.query.q
  let totalItems
  const MeetingList = await SelectMeetings(page, itemsPerPage, searchQuery)
  const total = await TotalMeetingsCount()

  if (searchQuery && searchQuery != "") {
    totalItems = MeetingList.length
  } else {
    totalItems = total[0].total_channels
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  res.json({ meetingsList: JSON.stringify(MeetingList), totalPages: totalPages, currentPage: page })
})
// Delete a CHannel 
router.get("/admin/meetings/delete", async (req, res) => {
  const channelSecret = req.query.channel
  const DeletedChannel = await DeleteChannel(channelSecret)

  res.json({ message: "channelDeleted" })

})


// GET List of Posters
router.get("/admin/posters/list", async (req, res) => {
  const page = req.query.page
  const itemsPerPage = 5; // Number of items to display per page
  const searchQuery = req.query.q
  let totalItems

  const PosterList = await SelectPosters(page, itemsPerPage, searchQuery)
  const total = await TotalPostersCount()

  if (searchQuery && searchQuery != "") {
    totalItems = PosterList.length
  } else {
    totalItems = total[0].total_posters
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  res.json({ PosterList: JSON.stringify(PosterList), totalPages: totalPages, currentPage: page })
})

router.get("/admin/posters/list/total", async (req, res) => {
  const TotalCount = await TotalPostersCount()

  res.json({ TotalPosters: TotalCount[0].total_posters })
})

router.post("/delete/:posterID", loggedIn, deletePoster)


// GET Meeting NAme 
router.get("/admin/meeting", async (req, res) => {
  const meetingId = req.query.name
  const MeetingName = await GetMeetingName(meetingId)
  res.json({ MeetingTitle: JSON.stringify(MeetingName) })
})
// Count Number of Meetings 
router.get("/admin/meetings/list/total", async (req, res) => {
  const TotalCount = await TotalMeetingsCount()

  res.json({ TotalChannels: TotalCount[0].total_channels })
})

router.get("/record", (req, res) => {
  res.render("recorderTest")
})


// End Posters
router.get("/channels/graph", GraphChannels)

// Waiting Rooms 
router.post("/v1/channel/join", waitingRoom)

// Login User 
router.get("/login", loginPage)
router.post("/api/login", login)
router.get("/logout", async (req, res) => {
  res.clearCookie('posterUser');
  res.redirect('/login');
})

// Create Poster Id 
router.get("/create/secret", async (req, res) => {
  if (req.cookies.posterUser) {
    res.render("createPosterSecret")
  } else {
    res.render("loginExternal")
  }
})
router.post("/create/new/posterid", generatePosterId)

// Chat presenter 
router.get("/chat/presenter/:spaceID", ChatPresenterPage)

// Edit posters page 
router.get("/edit/poster/:posterDeckLink", loggedIn, editPosterPage)

// Submit the edit poster form 
router.post("/editdeck", uploadFields, editDeck)


// Save Poster Ratings 
router.post("/saveRating", loggedIn, saveRatingToDB)

// Get Total Ratings  
router.get("/getTotalRatings", async (req, res) => {
  const posterId = req.query.pid
  return res.json(await GetTotalRatings(posterId))
})

// All Ratings  
router.get("/getAllRatings", async (req, res) => {
  const posterId = req.query.pid
  return res.json(await GetAllRatings(posterId))
})

router.get("/checkRatingExists", loggedIn, async (req, res) => {
  try {
    const user = req.user.username
    const posterId = req.query.pid
    const Rated = await CheckIfRatingExists(user, posterId)

    if (Rated[0] && Rated[0].rating) {
      return res.json({ error: "user_rated", currentRating: Rated[0].rating })
    } else {
      return res.json({ currentRating: 0 })
    }
  } catch (error) {
    console.log(error)
    return res.json({ error, currentRating: 0 })
  }
})

router.get("*", (req, res) => {
  res.render("error", { status: "Page Not Found", page: "/" })
})



module.exports = router; 