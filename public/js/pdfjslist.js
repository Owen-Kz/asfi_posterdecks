function pdfRenderer(urlArray, containerArray) {
  const pdfFileList = urlArray; // Array of PDF URLs
  const containersArray = containerArray; // Array of container IDs

  // Function to render a single PDF
  function renderPDF(url, containerId) {
    const container = document.getElementById(containerId);

    // Fetch the PDF file
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob(); // Get the response as a Blob
      })
      .then(blob => {
        // Create a URL for the Blob object
        const fileURL = URL.createObjectURL(blob);

        // Get the PDF document
        pdfjsLib.getDocument(fileURL).promise.then(pdf => {
          // for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            pdf.getPage(1).then(page => {
              const canvas = document.createElement('canvas');
              container.appendChild(canvas);
              const context = canvas.getContext('2d');
              const viewport = page.getViewport({ scale: 1 });

              // Set canvas dimensions
              canvas.width = viewport.width;
              canvas.height = viewport.height;

              const renderContext = {
                canvasContext: context,
                viewport: viewport,
              };
 
              const renderTask = page.render(renderContext);
              renderTask.promise.then(() => {
                // console.log(`Page 1 rendered`);
              });
            });
          // }
        });
      })
      .catch(error => {
        console.error('There was a problem fetching the PDF:', error);
      });
  }

  // Load and render each PDF
  
  pdfFileList.forEach((posterFile, index) => {
    renderPDF(`/files/uploaded/posterpdf/${posterFile}`, containersArray[index]);
  });
}
