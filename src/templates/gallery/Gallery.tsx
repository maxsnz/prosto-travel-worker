import React from "react";
import { MediaAttributes } from "../../services/types";

interface GalleryProps {
  items: MediaAttributes[];
}

const Gallery: React.FC<GalleryProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  if (items.length === 1) {
    if (!items[0]) return null;
    return (
      <img
        src={items[0].url}
        alt={items[0].alternativeText || "Gallery image"}
        style={{ width: "100%", objectFit: "cover", height: "570px" }}
      />
    );
  }

  if (items.length === 2) {
    return (
      <div style={{ display: "flex", gap: 24 }}>
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}
        >
          <img
            src={items[0].url}
            alt={items[0].alternativeText || `Gallery image 1`}
            style={{ width: "100%", objectFit: "cover", height: "570px" }}
          />
        </div>
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}
        >
          <img
            src={items[1].url}
            alt={items[1].alternativeText || `Gallery image 2`}
            style={{ width: "100%", objectFit: "cover", height: "570px" }}
          />
        </div>
      </div>
    );
  }

  if (items.length > 2) {
    return (
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1 }}>
          {items[0] && (
            <img
              src={items[0].url}
              alt={items[0].alternativeText || "Gallery image 1"}
              style={{
                width: "100%",
                objectFit: "cover",
                height: "100%",
                minHeight: "570px",
                maxHeight: "1164px",
              }}
            />
          )}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            justifyContent: "space-between",
          }}
        >
          <img
            src={items[1].url}
            alt={items[1].alternativeText || "Gallery image 2"}
            style={{ width: "100%", objectFit: "cover", height: "270px" }}
          />

          <img
            src={items[2].url}
            alt={items[2].alternativeText || "Gallery image 3"}
            style={{ width: "100%", objectFit: "cover", height: "270px" }}
          />
        </div>
      </div>
    );
  }
};

export default Gallery;
