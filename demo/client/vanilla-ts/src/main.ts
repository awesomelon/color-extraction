import "./style.css";
import { BrowserAdapter } from "../../../../src/Adapter/browserAdapter.js";
import { ColorExtractor } from "../../../../src/core";

document
  .getElementById("imageInput")
  .addEventListener("change", async (event) => {
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        const adapter = new BrowserAdapter();
        const colorExtractor = ColorExtractor.getInstance(adapter);
        const { colors, dominantColor } = await colorExtractor.extractColors({
          imageSource: img,
          k: 10,
          sampleRate: 0.1,
          onFilterSimilarColors: false,
          useHex: true,
        });
        console.log("Extracted Colors:", colors);
        console.log("Dominant Color:", dominantColor);
      };
    }
  });
