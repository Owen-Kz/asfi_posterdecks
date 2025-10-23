function pdfRenderer(urlArray, containerArray, isLinkArray = []) {
    const pdfFileList = urlArray;
    const containersArray = containerArray;
    const isLinkList = isLinkArray;

    function renderPDF(url, containerId, isLink = false) {
        const container = document.getElementById(containerId);
        console.log(`Rendering PDF: ${url}, isLink: ${isLink}, container: ${containerId}`);
        
        if (isLink) {
            // For Cloudinary links - show a nice preview card
            const previewDiv = document.createElement('div');
            previewDiv.className = 'w-full h-full flex flex-col items-center justify-center p-4';
            previewDiv.innerHTML = `
                <div class="text-center">
                    <div class="bg-white rounded-full p-3 mb-2 shadow-md">
                        <i class="fas fa-cloud text-2xl text-blue-500"></i>
                    </div>
                    <p class="text-gray-700 font-medium text-sm">Cloud PDF</p>
                    <p class="text-gray-500 text-xs mt-1">Click to view</p>
                </div>
            `;
            
            // Make the container clickable to open the PDF
            container.style.cursor = 'pointer';
            container.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(url, '_blank');
            });
            
            container.appendChild(previewDiv);
            
        } else {
            // For local files - use PDF.js
            const fetchUrl = `/files/uploaded/posterpdf/${url}`;
            
            fetch(fetchUrl)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.blob();
                })
                .then(blob => {
                    console.log('Got local PDF blob, size:', blob.size);
                    if (blob.size === 0) throw new Error('Empty PDF file');
                    
                    const fileURL = URL.createObjectURL(blob);
                    return pdfjsLib.getDocument(fileURL).promise;
                })
                .then(pdf => {
                    console.log('PDF.js loaded local document, pages:', pdf.numPages);
                    return pdf.getPage(1);
                })
                .then(page => {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    const viewport = page.getViewport({ scale: 0.3 }); // Slightly larger for better preview

                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    canvas.style.borderRadius = '4px';
                    canvas.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    canvas.style.maxWidth = '100%';
                    canvas.style.maxHeight = '100%';

                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                    };

                    container.appendChild(canvas);
                    return page.render(renderContext).promise;
                })
                .then(() => {
                    console.log('Local PDF thumbnail rendered successfully');
                })
                .catch(error => {
                    console.error('Error rendering local PDF thumbnail:', error);
                    // Show fallback for local files
                    container.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center p-4">
                            <div class="text-center">
                                <div class="bg-gray-100 rounded-full p-3 mb-2">
                                    <i class="fas fa-file-pdf text-xl text-gray-400"></i>
                                </div>
                                <p class="text-gray-500 text-sm">PDF Preview</p>
                                <p class="text-gray-400 text-xs mt-1">Click to view</p>
                            </div>
                        </div>
                    `;
                });
        }
    }

    // Load and render each PDF
    pdfFileList.forEach((posterFile, index) => {
        const isLink = isLinkList[index] || false;
        renderPDF(posterFile, containersArray[index], isLink);
    });
}