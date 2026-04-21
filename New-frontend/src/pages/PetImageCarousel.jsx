import { useState } from "react";
import "./PetImageCarousel.css";

const FALLBACK_IMAGE = "/images/no-pet.png";

const PetImageCarousel = ({ images = [] }) => {
  const [index, setIndex] = useState(0);
  const validImages = images.filter(Boolean);

  if (!validImages.length) {
    return (
      <div className="carousel">
        <img src={FALLBACK_IMAGE} className="carousel-img" alt="no-img" />
      </div>
    );
  }

  return (
    <div className="carousel-wrapper">
      <div className="carousel">
        <button
          className="carousel-btn left"
          onClick={() =>
            setIndex((index - 1 + validImages.length) % validImages.length)
          }
        >
          ‹
        </button>

        <img
          src={validImages[index]}
          alt="pet"
          className="carousel-img"
          onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
        />

        <button
          className="carousel-btn right"
          onClick={() =>
            setIndex((index + 1) % validImages.length)
          }
        >
          ›
        </button>
      </div>

      {validImages.length > 1 && (
        <div className="carousel-thumbs">
          {validImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="thumb"
              className={`thumb ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PetImageCarousel;
