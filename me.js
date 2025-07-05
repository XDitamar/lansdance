document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element References ---
  const customNameInput = document.getElementById('customName');
  const customCountInput = document.getElementById('customCount'); // Password input
  const loadCustomGalleryButton = document.getElementById('loadCustomGallery');
  const customGalleryDiv = document.getElementById('customGallery');
  const myLightbox = document.getElementById('myLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxVideo = document.getElementById('lightboxVideo');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightbox = document.querySelector('.close-lightbox');
  const downloadMediaButton = document.getElementById('downloadMedia'); // New: Download button

  // --- Authentication Data with File Counts ---
  // Format: 'username': 'password:pngCount:mp4Count'
  const allowedGalleries = {
    ben: '12:16:1', // username 'ben', password '12', 16 PNGs, 1 MP4
  };

  // --- Load Button Click ---
  loadCustomGalleryButton.addEventListener('click', async () => {
    const folderName = customNameInput.value.trim().toLowerCase();
    const enteredPassword = customCountInput.value.trim();

    // Reset gallery display
    customGalleryDiv.innerHTML = '';
    customGalleryDiv.style.display = 'none';

    if (allowedGalleries[folderName]) {
      const storedCombinedData = allowedGalleries[folderName];
      const parts = storedCombinedData.split(':');

      if (parts.length === 3) {
        const storedPassword = parts[0];
        const pngCount = parseInt(parts[1], 10);
        const mp4Count = parseInt(parts[2], 10);

        if (enteredPassword === storedPassword) {
          alert(`Logged in as ${folderName}!`);
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

  // --- Load Gallery Content ---
  async function loadGalleryContent(folderName, pngCount, mp4Count) {
    let loadedItems = 0;
    const photoItems = [];

    // Create image photo item
    const createAndAddPhotoItem = (path, altText) => {
      const photoItem = document.createElement('div');
      photoItem.className = 'photo-item';

      const realImg = document.createElement('img');
      realImg.src = path;
      realImg.alt = altText;
      realImg.loading = 'lazy';

      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.innerHTML = '<span>View Photo</span>';

      photoItem.appendChild(realImg);
      photoItem.appendChild(overlay);

      photoItem.addEventListener('click', () => {
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.src = '';
        downloadMediaButton.style.display = 'none'; // Hide download for video initially

        lightboxImg.style.display = 'block';
        lightboxImg.src = realImg.src;
        lightboxCaption.textContent = realImg.alt;

        // Set download button attributes for image
        downloadMediaButton.href = realImg.src;
        downloadMediaButton.download = realImg.src.split('/').pop(); // Suggest filename
        downloadMediaButton.style.display = 'inline-block'; // Show download button

        myLightbox.style.display = 'flex';
      });

      photoItems.push(photoItem);
    };

    // Create video photo item
    const createAndAddVideoItem = (path, altText, index) => {
      const videoItem = document.createElement('div');
      videoItem.className = 'photo-item video-item';

      videoItem.innerHTML = `
        <video src="${path}" preload="metadata" muted playsinline style="width: 100%; border-radius: 10px;" ></video>
        <div class="overlay"><span>Watch Video</span></div>
      `;

      videoItem.addEventListener('click', () => {
        lightboxImg.style.display = 'none';
        lightboxImg.src = '';
        downloadMediaButton.style.display = 'none'; // Hide download for image initially

        lightboxVideo.style.display = 'block';
        lightboxVideo.src = path;
        lightboxVideo.play();

        lightboxCaption.textContent = altText;

        // Set download button attributes for video
        downloadMediaButton.href = path;
        downloadMediaButton.download = path.split('/').pop(); // Suggest filename
        downloadMediaButton.style.display = 'inline-block'; // Show download button

        myLightbox.style.display = 'flex';
      });

      photoItems.push(videoItem);
    };

    // Load PNGs
    for (let i = 1; i <= pngCount; i++) {
      const imgPath = `/pics/${folderName}/${i}.png`;

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
          resolve();
        };
      });
    }

    // Load MP4s
    for (let i = 1; i <= mp4Count; i++) {
      const videoPath = `/pics/${folderName}/${i}.mp4`;

      // We don't preload videos, just add the item
      loadedItems++;
      createAndAddVideoItem(videoPath, `${folderName} - video ${i}`, i);
    }

    if (photoItems.length > 0) {
      photoItems.forEach((item) => customGalleryDiv.appendChild(item));
      customGalleryDiv.style.display = 'grid';
    } else {
      customGalleryDiv.innerHTML = '<p>No photos or videos found.</p>';
      customGalleryDiv.style.display = 'block';
    }

    if (loadedItems < pngCount + mp4Count) {
      alert(
        `Warning: Only ${loadedItems} out of ${pngCount + mp4Count} expected items were found for "${folderName}". Please ensure all files exist.`
      );
    }
  }

  // --- Lightbox Close Logic ---
  function closeLightboxFunc() {
    myLightbox.style.display = 'none';
    lightboxVideo.pause();
    lightboxVideo.src = '';
    lightboxImg.src = '';
    downloadMediaButton.style.display = 'none'; // Hide download button when closing
    downloadMediaButton.href = '#'; // Reset href
    downloadMediaButton.download = ''; // Reset download attribute
  }

  closeLightbox.addEventListener('click', closeLightboxFunc);

  myLightbox.addEventListener('click', (e) => {
    // Only close if the click is directly on the lightbox background, not its children
    if (e.target === myLightbox) {
      closeLightboxFunc();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && myLightbox.style.display === 'flex') {
      closeLightboxFunc();
    }
  });
});