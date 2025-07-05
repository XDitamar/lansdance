document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('myLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeLightbox = document.querySelector('.close-lightbox');
    const loadCustomGalleryButton = document.getElementById('loadCustomGallery');
    const customNameInput = document.getElementById('customName');
    const customCountInput = document.getElementById('customCount');
    const galleryContainer = document.getElementById('customGallery');

    // --- START: Anti-Copying/Screenshot Measures ---

    // 1. Disable right-click context menu to prevent "Save Image As..."
    document.addEventListener('contextmenu', event => {
        event.preventDefault();
        console.log("Right-click disabled to protect content."); // For debugging
    });

    // 2. Prevent dragging of images to desktop
    document.addEventListener('dragstart', event => {
        if (event.target.tagName === 'IMG') {
            event.preventDefault();
            console.log("Image dragging disabled to protect content."); // For debugging
        }
    });

    // 3. Obscure content on Print Screen key press (primarily for desktop users)
    document.addEventListener('keydown', (e) => {
        // e.key: 'PrintScreen' is standard for modern browsers
        // e.keyCode: 44 is the legacy code for PrintScreen
        // Check for other common screenshot key combinations if desired,
        // but it becomes complex and OS-dependent very quickly.
        if (e.key === 'PrintScreen' || e.keyCode === 44) {
            console.log("PrintScreen key detected. Attempting to obscure content."); // For debugging

            // Create a temporary black overlay element
            let blackOverlay = document.createElement('div');
            blackOverlay.style.position = 'fixed';
            blackOverlay.style.top = '0';
            blackOverlay.style.left = '0';
            blackOverlay.style.width = '100vw'; // Full viewport width
            blackOverlay.style.height = '100vh'; // Full viewport height
            blackOverlay.style.backgroundColor = 'black'; // Black color
            blackOverlay.style.zIndex = '9999999'; // High z-index to be on top of everything
            blackOverlay.style.pointerEvents = 'none'; // Essential: allows clicks/hovers to pass through to underlying elements
            document.body.appendChild(blackOverlay);

            // Remove the overlay very quickly after a short delay.
            // This short delay is crucial: it's intended to flash the overlay *during* the screenshot capture
            // but remove it so it's barely noticeable to the user viewing the live page.
            setTimeout(() => {
                if (document.body.contains(blackOverlay)) {
                    document.body.removeChild(blackOverlay);
                }
            }, 50); // 50 milliseconds - experiment with this value if needed
        }
    });

    // --- END: Anti-Copying/Screenshot Measures ---


    // --- Custom Gallery Loading Logic (Your existing functional code) ---

    loadCustomGalleryButton.addEventListener('click', async () => {
        const name = customNameInput.value.trim();
        const count = parseInt(customCountInput.value);

        galleryContainer.innerHTML = ''; // Clear previous gallery content
        galleryContainer.style.display = 'none'; // Hide gallery while loading

        if (!name || isNaN(count) || count < 1) {
            alert('Please enter a valid folder name and a number of photos (1 or more).');
            return;
        }

        let loadedImagesCount = 0;
        const photoPromises = [];
        const photoItems = []; // Array to store created photo item elements

        // Create an array of Promises, each representing an image load attempt
        for (let i = 1; i <= count; i++) {
            const imgPath = `/pics/${name}/${i}.png`; // Assuming images are .png
            photoPromises.push(new Promise((resolve) => {
                const img = new Image(); // Use Image object to pre-load and check for errors
                img.src = imgPath;

                img.onload = () => {
                    loadedImagesCount++;
                    // Create the photo item and its elements
                    const photoItem = document.createElement('div');
                    photoItem.className = 'photo-item';

                    const realImg = document.createElement('img');
                    realImg.src = imgPath;
                    realImg.alt = `${name} - photo ${i}`; // Alt text for accessibility and debugging

                    const overlay = document.createElement('div');
                    overlay.className = 'overlay';
                    overlay.innerHTML = '<span>View Photo</span>';

                    photoItem.appendChild(realImg);
                    photoItem.appendChild(overlay);

                    // Add click listener to open lightbox
                    photoItem.addEventListener('click', () => {
                        lightbox.style.display = 'flex'; // Use flex to center content
                        lightboxImg.src = realImg.src;
                        lightboxCaption.innerHTML = realImg.alt;
                    });

                    photoItems.push(photoItem); // Add to our list of successful photo items
                    resolve(true); // Resolve the promise indicating success
                };

                img.onerror = () => {
                    console.warn(`Could not load image: ${imgPath}`);
                    resolve(false); // Resolve the promise indicating failure (don't block other images)
                };
            }));
        }

        // Wait for all image loading attempts to complete
        await Promise.all(photoPromises);

        // Provide feedback based on loading results
        if (loadedImagesCount === 0) {
            alert(`No images found in the folder "${name}". Please check the folder name and ensure images are .png files.`);
        } else if (loadedImagesCount < count) {
            alert(`Only ${loadedImagesCount} out of ${count} images were found in the folder "${name}". Displaying available images.`);
        }

        // Display the gallery if any images were loaded
        if (photoItems.length > 0) {
            // Sort photoItems by their original numeric index to maintain order
            photoItems.sort((a, b) => {
                const aNum = parseInt(a.querySelector('img').alt.match(/photo (\d+)/)[1]);
                const bNum = parseInt(b.querySelector('img').alt.match(/photo (\d+)/)[1]);
                return aNum - bNum;
            });

            photoItems.forEach(item => galleryContainer.appendChild(item));
            galleryContainer.style.display = 'grid'; // Show the gallery as a grid
        }
    });

    // --- Lightbox Close Handlers (Your existing functional code) ---

    // Close lightbox when 'x' is clicked
    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    // Close lightbox when clicking outside the image (on the dark background)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            lightbox.style.display = 'none';
        }
    });

    // Google Translate initialization (Keep this if your HTML explicitly calls googleTranslateElementInit)
    function googleTranslateElementInit() {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
    }
    // Ensure this function is available globally if Google's script needs to call it.
    // window.googleTranslateElementInit = googleTranslateElementInit;
});