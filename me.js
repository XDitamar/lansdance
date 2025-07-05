// /js/gallery.js
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('myLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightbox = document.querySelector('.close-lightbox');

  document.getElementById('loadCustomGallery').addEventListener('click', async () => {
    const name = document.getElementById('customName').value.trim();
    const count = parseInt(document.getElementById('customCount').value);
    const galleryContainer = document.getElementById('customGallery');

    galleryContainer.innerHTML = '';
    galleryContainer.style.display = 'none';

    if (!name || isNaN(count) || count < 1) {
      alert('Please enter a valid folder name and photo count.');
      return;
    }

    let loadedImages = 0;
    const photoItems = [];

    for (let i = 1; i <= count; i++) {
      const imgPath = `/pics/${name}/${i}.png`;

      await new Promise((resolve) => {
        const img = new Image();
        img.src = imgPath;

        img.onload = () => {
          loadedImages++;

          const photoItem = document.createElement('div');
          photoItem.className = 'photo-item';

          const realImg = document.createElement('img');
          realImg.src = imgPath;
          realImg.alt = `${name} - photo ${i}`;

          const overlay = document.createElement('div');
          overlay.className = 'overlay';
          overlay.innerHTML = '<span>View Photo</span>';

          photoItem.appendChild(realImg);
          photoItem.appendChild(overlay);

          photoItem.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            lightboxImg.src = realImg.src;
            lightboxCaption.innerHTML = realImg.alt;
          });

          photoItems.push(photoItem);
          resolve();
        };

        img.onerror = () => resolve();
      });
    }

    if (loadedImages < count) {
      alert(`Only ${loadedImages} out of ${count} images exist in the folder "${name}". Please enter the correct number.`);
    } else {
      photoItems.forEach(item => galleryContainer.appendChild(item));
      galleryContainer.style.display = 'grid';
    }
  });

  closeLightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = 'none';
    }
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'PrintScreen' || e.keyCode === 44) {
    // Show black overlay
    let blackOverlay = document.createElement('div');
    blackOverlay.style.position = 'fixed';
    blackOverlay.style.top = '0';
    blackOverlay.style.left = '0';
    blackOverlay.style.width = '100vw';
    blackOverlay.style.height = '100vh';
    blackOverlay.style.backgroundColor = 'black';
    blackOverlay.style.zIndex = '9999999';
    blackOverlay.style.pointerEvents = 'none';
    document.body.appendChild(blackOverlay);

    // Remove overlay after 1 second
    setTimeout(() => {
      document.body.removeChild(blackOverlay);
    }, 1000);
  }
});
