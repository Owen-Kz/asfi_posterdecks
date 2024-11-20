const body = document.querySelector("body")
const pdfLink = document.querySelectorAll(".pdfLink")
const presenterImage = document.querySelector("#presenterImage")
const PosterDeckFile = document.getElementById("posterDeckFile")
const PresenterImageFile = document.getElementById("presenterImageFile")


if(PosterDeckFile) {
fetch(`/files/uploaded/posterpdf/${PosterDeckFile.value}`, ()=>{
    method:"GET"
})
.then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.blob(); // Get the response as a Blob
  })
  .then(blob => {
    const PDF_FILR_ARRAY = []

    // Create a URL for the Blob object
    const fileURL = URL.createObjectURL(blob);


    PDF_FILR_ARRAY.push(fileURL)

    // Use the fileURL to display the PDF in an iframe or link to download
    pdfLink.forEach(link =>{
        link.setAttribute("href", fileURL)
    })
    // Load and render each PDF
  for (let i = 0; i < PDF_FILR_ARRAY.length; i++) {
    renderPDF(PDF_FILR_ARRAY[i], `pdf-container-${i + 1}`);
  }

  })
  .catch(error => {
    console.error('There was a problem fetching the PDF:', error);
    // Handle errors, display a message, etc.
  });
}


const chatPresenter = document.getElementById("chatPresenter")
const chatBox = document.getElementById("chatBox")
if(chatPresenter){
  chatPresenter.addEventListener("click", function(e){
    e.preventDefault()
    chatBox.classList.toggle("small")
  })
}

const closeChat = document.getElementById("closeChat")
const closeBox = document.getElementById("chatBox")
if(closeChat){
  closeChat.addEventListener("click", function(e){
    e.preventDefault()
    closeBox.classList.toggle("small")
  })
}

const ZoomItem = document.getElementById("pdfLink")
const filePreviewContainer = document.getElementById("filePreviewContainer")
if(ZoomItem){
ZoomItem.addEventListener("click", function(e){
  e.preventDefault()
  filePreviewContainer.classList.toggle("huge-preview")
})
}
// // READ FILE LIST FUNCTION 
// function readPDFList(pdfFileList, containersArray){
//     pdfFileList.forEach(posterFile =>{
//         fetch(`/files/uploaded/posterpdf/${posterFile}`, ()=>{
//             method:"GET"
//         })
//         .then(response => {
//             if (!response.ok) {
//               throw new Error('Network response was not ok');
//             }
//             return response.blob(); // Get the response as a Blob
//           })
//           .then(blob => {
//             const PDF_FILR_ARRAY = []
        
//             // Create a URL for the Blob object
//             const fileURL = URL.createObjectURL(blob);
        
        
//             PDF_FILR_ARRAY.push(fileURL)
        
//             // Use the fileURL to display the PDF in an iframe or link to download
//             pdfLink.forEach(link =>{
//                 link.setAttribute("href", fileURL)
//             })
//             // Load and render each PDF
          
//         //   renderPDF(PDF_FILR_ARRAY[0], containersArray)
//           console.log(PDF_FILR_ARRAY)
        
//           })
//           .catch(error => {
//             console.error('There was a problem fetching the PDF:', error);
//           })
//     })
// }




//   For Presenter Profile Image 
// if(PresenterImageFile){
// fetch(`/files/uploaded/presenterImage/${PresenterImageFile.value}`, ()=>{
//     method:"GET"
// })
// .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.blob(); // Get the response as a Blob
//   })
//   .then(blob => {
//     // Create a URL for the Blob object
//     const fileURL = URL.createObjectURL(blob);

//     // Use the fileURL to display the PDF in an iframe or link to download
//     presenterImage.setAttribute("src", fileURL)
 

//   })
//   .catch(error => {
//     console.error('There was a problem fetching the image:', error);
//     // Handle errors, display a message, etc.
//   });
// }