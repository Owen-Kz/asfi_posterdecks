function pdfRenderer(urlArray, ContainerArray){
  // const posterDeckFile = document.getElementById("posterDeckFile")

const pdfFileUrls = urlArray; // Add more PDF URLs if needed

// Function to render a PDF
function renderPDF(url, containerId) {
  const container = document.getElementById(containerId);

  // Fetch the PDF file
  const loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then(pdf => {
    for (let pageNum = 1; pageNum <= 1; pageNum++) {
      pdf.getPage(pageNum).then(page => {
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale:1 });
        const scale = Math.min(canvas.width / viewport.width, canvas.height / viewport.height);
              // Make it visually fill the positioned parent
        canvas.style.width ='100%';
        canvas.style.height='100%';
        // ...then set the internal size to match
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const renderViewport = page.getViewport({ scale });


        
        const renderTask = page.render({ canvasContext: context, viewport: renderViewport });
        renderTask.promise.then(() => {
          console.log(`Page ${pageNum} rendered`);
        });
      });
    }
  });
}

// Load and render each PDF
for (let i = 0; i < pdfFileUrls.length; i++) {
  renderPDF(pdfFileUrls[i], ContainerArray[i]);
}

}