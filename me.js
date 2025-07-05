document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const customNameInput = document.getElementById('customName');
    const customCountInput = document.getElementById('customCount'); // This input takes the combined password
    const loadCustomGalleryButton = document.getElementById('loadCustomGallery');
    const customGalleryDiv = document.getElementById('customGallery');
    const myLightbox = document.getElementById('myLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeLightbox = document.querySelector('.close-lightbox');

    // --- Authentication Data with File Counts ---
    // Format: 'username': 'password:pngCount:mp4Count'
    // IMPORTANT: This data is hardcoded for demonstration purposes ONLY.
    // For a real application, implement server-side authentication for security.
    const allowedGalleries = {
        'ben': '12:16:0',       // User 'ben', password '12', 16 PNGs, 0 MP4s
        'landscapes': 'securepass:12:0', // User 'landscapes', password 'securepass', 12 PNGs, 0 MP4s
        'portraits': 'photo_secret:10:0', // User 'portraits', password 'photo_secret', 10 PNGs, 0 MP4s
        'animals': 'wildlife_pix:7:2'   // User 'animals', password 'wildlife_pix', 7 PNGs, 2 MP4s
    };

    // --- Event Listener for Load Button (Authentication & Gallery Loading) ---
    loadCustomGalleryButton.addEventListener('click', async () => {
        const folderName = customNameInput.value.trim().toLowerCase();
        const enteredPassword = customCountInput.value.trim(); // User only enters the password part

        // Reset gallery display
        customGalleryDiv.innerHTML = '';
        customGalleryDiv.style.display = 'none';

        // 1. Authenticate User
        if (allowedGalleries[folderName]) {
            const storedCombinedData = allowedGalleries[folderName];
            const parts = storedCombinedData.split(':');

            if (parts.length === 3) {
                const storedPassword = parts[0];
                const pngCount = parseInt(parts[1], 10);
                const mp4Count = parseInt(parts[2], 10);

                if (enteredPassword === storedPassword) {
                    alert(`Logged in as ${folderName}!`);
                    console.log(`Authentication successful for folder: ${folderName}`);
                    // Proceed to load gallery based on the counts from allowedGalleries
                    await loadGalleryContent(folderName, pngCount, mp4Count);
                } else {
                    alert('Invalid password. Please try again.');
                }
            } else {
                alert('Internal error: Gallery data malformed. Please contact support.');
                console.error(`Malformed data for ${folderName}: ${storedCombinedData}`);
            }
        } else {
            alert('Invalid name or password. Please try again.');
        }
    });

    // --- Function to Load Gallery Content (combining your image loading logic) ---
    async function loadGalleryContent(folderName, pngCount, mp4Count) {
        let loadedItems = 0;
        const photoItems = []; // To hold all constructed photo/video items

        // Function to create a photo item and add to photoItems array
        const createAndAddPhotoItem = (path, altText) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';

            const realImg = document.createElement('img');
            realImg.src = path;
            realImg.alt = altText;
            realImg.loading = 'lazy'; // Add lazy loading

            const overlay = document.createElement('div');
            overlay.className = 'overlay';
            overlay.innerHTML = '<span>View Photo</span>';

            photoItem.appendChild(realImg);
            photoItem.appendChild(overlay);

            photoItem.addEventListener('click', () => {
                myLightbox.style.display = 'flex'; // Use flex for centering
                lightboxImg.src = realImg.src;
                lightboxCaption.innerHTML = realImg.alt;
            });
            photoItems.push(photoItem);
        };

        // --- Load PNG Images ---
        for (let i = 1; i <= pngCount; i++) {
            const imgPath = `/pics/${folderName}/${i}.png`;

            // Use the Promise-based loading from your original code
            await new Promise((resolve) => {
                const img = new Image();
                img.src = imgPath;

                img.onload = () => {
                    loadedItems++;
                    createAndAddPhotoItem(imgPath, `${folderName} - photo ${i}`);
                    resolve();
                };
                img.onerror = () => {
                    console.warn(`Could not load PNG: ${imgPath}`);
                    resolve(); // Resolve even on error to continue loop
                };
            });
        }

        // --- Load MP4 Videos ---
        // Note: Your lightbox is designed for images. For MP4s, this will add a placeholder.
        // To properly show videos, your lightbox HTML and JS would need to be enhanced.
        for (let i = 1; i <= mp4Count; i++) {
            const videoPath = `/pics/${folderName}/${i}.mp4`;

            // For videos, we're not pre-loading like images, just adding a placeholder/link
            // as the lightbox doesn't support video directly.
            const videoItem = document.createElement('div');
            videoItem.className = 'photo-item video-item'; // Add 'video-item' for specific styling if needed
            videoItem.innerHTML = `
                <video src="${videoPath}" controls preload="metadata" loading="lazy" 
                       poster="/pics/video_placeholder.png" alt="Video ${i} from ${folderName}"></video>
                <div class="overlay"><span>Watch Video</span></div>
            `;
            // If you want a click on the item to open the video in a new tab:
            videoItem.addEventListener('click', () => {
                window.open(videoPath, '_blank');
            });

            photoItems.push(videoItem);
            loadedItems++; // Count it as a loaded item
        }


        // --- Display Gallery ---
        if (photoItems.length > 0) { // Check if any items were added (PNGs or MP4s)
            photoItems.forEach(item => customGalleryDiv.appendChild(item));
            customGalleryDiv.style.display = 'grid'; // Show the gallery
        } else {
            customGalleryDiv.innerHTML = '<p>No photos or videos found for this user, or paths are incorrect.</p>';
            customGalleryDiv.style.display = 'block'; // Show message
        }

        if (loadedItems < (pngCount + mp4Count)) {
             alert(`Warning: Only ${loadedItems} out of ${pngCount + mp4Count} expected items were found for "${folderName}". Please ensure all files exist.`);
        }
    }


    // --- Lightbox Functionality (from your original code) ---
    closeLightbox.addEventListener('click', () => {
        myLightbox.style.display = 'none';
        // Stop any playing video in the lightbox if you extend it for videos
        if (lightboxImg.tagName === 'VIDEO') {
            lightboxImg.pause();
        }
    });

    myLightbox.addEventListener('click', (e) => {
        if (e.target === myLightbox) {
            myLightbox.style.display = 'none';
            // Stop any playing video in the lightbox
            if (lightboxImg.tagName === 'VIDEO') {
                lightboxImg.pause();
            }
        }
    });

    // Optional: Close lightbox with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && myLightbox.style.display === 'flex') { // Check for 'flex'
            myLightbox.style.display = 'none';
            // Stop any playing video in the lightbox
            if (lightboxImg.tagName === 'VIDEO') {
                lightboxImg.pause();
            }
        }
    });
});