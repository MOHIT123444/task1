import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [images, setImages] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState('');
  const [fullscreenVisible, setFullscreenVisible] = useState(false);

  const createThumbnail = (imageNumber) => (
    <div className={`thumbnail alternating-background`} key={imageNumber}>
      <img
        src={`http://via.placeholder.com/200x200?text=${imageNumber}`}
        alt={`Image ${imageNumber}`}
        className="thumbnail-image"
        onClick={() => openFullscreenView(imageNumber)}
      />
    </div>
  );

  const loadImages = (page, count) => {
    const start = (page - 1) * count;
    const images = [];
    for (let i = start; i < start + count; i++) {
      images.push(createThumbnail(i));
    }
    setCurrentPage(page + 1); // Increase the current page
    return images;
  };

  const openFullscreenView = (imageNumber) => {
    setFullscreenImage(`http://via.placeholder.com/2000x2000?text=${imageNumber}`);
    setFullscreenVisible(true);
  };

  const closeFullscreenView = () => {
    setFullscreenVisible(false);
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      // Load more images when user is near the bottom
      loadMoreImages();
    }
  };

  const loadMoreImages = () => {
    const newImages = loadImages(currentPage, 30);
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  useEffect(() => {
    const initialImages = loadImages(currentPage, 30);
    setImages(initialImages);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleKeyDown = (event) => {
    if (fullscreenVisible) {
      if (event.key === 'ArrowLeft') {
        // Move to the previous image
        navigateImage(-1);
      } else if (event.key === 'ArrowRight') {
        // Move to the next image
        navigateImage(1);
      }
    }
  };

  const navigateImage = (direction) => {
    const currentImageIndex = parseInt(fullscreenImage.match(/\d+/)[0]);
    const newIndex = currentImageIndex + direction;
    if (newIndex >= 1 && newIndex <= images.length) {
      setFullscreenImage(`http://via.placeholder.com/2000x2000?text=${newIndex}`);
    }
  };

  const handleFullscreenImageNavigation = (event) => {
    if (fullscreenVisible) {
      if (event.key === 'ArrowLeft') {
        // Move to the previous image
        navigateImage(-1);
      } else if (event.key === 'ArrowRight') {
        // Move to the next image
        navigateImage(1);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      <header className="header">
        <h1>Photo Grid App</h1>
      </header>
      <div className="grid">
        {images}
      </div>
      {fullscreenVisible && (
        <div className="fullscreen-overlay" onClick={closeFullscreenView}>
          <div className="fullscreen-content">
            <button className="navigation-button left-button" onClick={() => navigateImage(-1)}>
              &#8249; {/* Left arrow character */}
            </button>
            <img
              src={fullscreenImage}
              alt="Fullscreen"
              className="fullscreen-image"
              tabIndex="0"
              onKeyDown={handleFullscreenImageNavigation}
            />
            <button className="navigation-button right-button" onClick={() => navigateImage(1)}>
              &#8250; {/* Right arrow character */}
            </button>
            <a
              className="download-button"
              href={`http://via.placeholder.com/3900x3900?text=${images.length}`}
              download
            >
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
