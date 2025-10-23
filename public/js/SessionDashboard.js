const posterDeckMain = document.getElementById("posterDeckMain");

fetch(`/posteradmin`, {
    method: "GET"
}).then(res => res.json())
.then(data => {
    const allPosterDecks = JSON.parse(data.PosterDecks);
    
    if (allPosterDecks.length > 0) {
        posterDeckMain.innerHTML = ''; // Clear loading state
        
        allPosterDecks.forEach(posterDeck => {
            const posterDeckTitle = posterDeck.poster_deck_title;
            const posterDeckLink = posterDeck.poster_deck_id;
            const posterDeckOwner = posterDeck.poster_deck_owner;
            const posterDeckDescription = posterDeck.poster_deck_descritiption;
            const posterDeckImage = posterDeck.poster_deck_image;
            const previewImage = posterDeck.poster_preview_image;
            const createdAt = posterDeck.created_at ? new Date(posterDeck.created_at).toLocaleDateString() : 'Unknown date';
            
            // Use preview image if available, otherwise fallback to a placeholder
            const displayImage = previewImage && previewImage !== 'null' ? previewImage : '/images/default-poster-preview.jpg';
            
            posterDeckMain.innerHTML += `
                <div class="bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100 overflow-hidden group">
                    <div class="flex flex-col lg:flex-row">
                        <!-- Poster Preview -->
                        <div class="lg:w-1/3 p-6 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                            <div class="relative w-full max-w-xs">
                                <img 
                                    src="${displayImage}" 
                                    alt="${posterDeckTitle}" 
                                    class="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                                    onerror="this.src='/images/default-poster-preview.jpg'"
                                />
                                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 rounded-lg"></div>
                                <div class="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full p-1.5 shadow-sm">
                                    <i class="fas fa-file-pdf text-red-500 text-sm"></i>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Poster Details -->
                        <div class="lg:w-2/3 p-6">
                            <div class="flex flex-col h-full">
                                <!-- Header -->
                                <div class="flex-1">
                                    <div class="flex items-start justify-between mb-3">
                                        <h3 class="text-xl font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
                                            ${posterDeckTitle}
                                        </h3>
                                        <span class="bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ml-3">
                                            ${createdAt}
                                        </span>
                                    </div>
                                    
                                    <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                                        ${posterDeckDescription || 'No description provided'}
                                    </p>
                                    
                                    <div class="flex items-center text-sm text-gray-500 mb-4">
                                        <i class="fas fa-user-graduate text-primary-500 mr-2"></i>
                                        <span class="font-medium">${posterDeckOwner}</span>
                                    </div>
                                    
                                    <div class="flex items-center text-sm text-gray-500">
                                        <i class="fas fa-hashtag text-gray-400 mr-2"></i>
                                        <span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded">${posterDeckLink}</span>
                                    </div>
                                </div>
                                
                                <!-- Action Buttons -->
                                <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-100 mt-4">
                                    <button onclick="window.location.href='/event/poster/${posterDeckLink}'" 
                                            class="flex items-center px-4 py-2 bg-primary-700 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-all duration-200 hover:shadow-md group/btn">
                                        <i class="fas fa-eye mr-2 group-hover/btn:scale-110 transition-transform"></i>
                                        Preview Poster
                                    </button>
                                    
                                    <button onclick="window.location.href='/edit/poster/${posterDeckLink}'" 
                                            class="flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:border-primary-300 hover:text-primary-600 transition-all duration-200 group/btn">
                                        <i class="fas fa-edit mr-2 group-hover/btn:scale-110 transition-transform"></i>
                                        Edit Details
                                    </button>
                                    
                                    <form action="/delete/${posterDeckLink}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this poster? This action cannot be undone.');">
                                        <button type="submit" 
                                                class="flex items-center px-4 py-2 bg-white text-red-600 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200 group/btn">
                                            <i class="fas fa-trash-alt mr-2 group-hover/btn:scale-110 transition-transform"></i>
                                            Delete Poster
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    } else {
        posterDeckMain.innerHTML = `
            <div class="text-center py-16">
                <div class="max-w-md mx-auto">
                    <div class="bg-gradient-to-br from-primary-50 to-purple-100 rounded-2xl p-8 mb-6">
                        <i class="fas fa-file-pdf text-6xl text-primary-500 mb-4"></i>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Posters Yet</h3>
                        <p class="text-gray-600 mb-6">You haven't uploaded any posters yet. Get started by creating your first poster presentation.</p>
                        <button onclick="window.location.href='/uploadPoster'" 
                                class="btn-primary inline-flex items-center">
                            <i class="fas fa-plus mr-2"></i>
                            Create Your First Poster
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}).catch(error => {
    console.error('Error fetching poster decks:', error);
    posterDeckMain.innerHTML = `
        <div class="text-center py-16">
            <div class="max-w-md mx-auto">
                <div class="bg-red-50 border border-red-200 rounded-2xl p-8">
                    <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                    <h3 class="text-xl font-semibold text-red-900 mb-2">Unable to Load Posters</h3>
                    <p class="text-red-700 mb-6">There was an error loading your posters. Please try again later.</p>
                    <button onclick="location.reload()" 
                            class="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">
                        <i class="fas fa-redo mr-2"></i>
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    `;
});