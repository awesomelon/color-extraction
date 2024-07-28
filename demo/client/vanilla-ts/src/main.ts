import "./style.css";
import { ColorExtractor } from "simply-color-extraction";
import { BrowserAdapter } from "simply-color-extraction/browserAdapter";

document?.getElementById("imageInput")?.addEventListener("change", async (event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (!file) {
    alert("Please select a file first.");
    return;
  }

  // 기존 색상 박스 초기화
  const colorsContainer = document.getElementById("colorsContainer");
  if(colorsContainer) {
    colorsContainer.innerHTML = "";
  }

  // 지배적인 색상 초기화
  const dominantColorBox = document.getElementById("dominantColor");
  if(dominantColorBox) {
    dominantColorBox.style.display = "none";
    dominantColorBox.style.backgroundColor = "";
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const imagePreview = document.getElementById("imagePreview") as HTMLImageElement;
    if (imagePreview && e.target) {
      imagePreview.src = e.target.result as string;
      imagePreview.style.display = "block";
      const extractButton =document.getElementById("extractButton");
      if(extractButton) {
        extractButton.style.display = "block";
      }
    }

  };
  reader.readAsDataURL(file);
});

document?.getElementById("extractButton")?.addEventListener("click", async () => {
  const imagePreview = document.getElementById("imagePreview") as HTMLImageElement;

  if (!imagePreview.src) {
    alert("Please select an image first.");
    return;
  }

  const img = document.createElement("img");
  img.src = imagePreview.src;
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

    displayColors(colors, dominantColor);
  };

  function displayColors(colors: string[], dominantColor: string) {
    const container = document.getElementById("colorsContainer");
    if(container) {
      container.innerHTML = "";
      colors.forEach((color) => {
        const colorDiv = document.createElement("div");
        colorDiv.className = "color-box";
        colorDiv.style.backgroundColor = color;
        colorDiv.addEventListener("click", () => copyToClipboard(color));
        container.appendChild(colorDiv);
      });
    }

    const dominantColorBox = document.getElementById("dominantColor");
    if(dominantColorBox) {
      dominantColorBox.style.backgroundColor = dominantColor;
      dominantColorBox.style.display = "flex";

      // 이벤트 리스너를 중복 추가하지 않도록 설정
      dominantColorBox.onclick = () => copyToClipboard(dominantColor);
    }
  }

  function copyToClipboard(color: string) {
    const tempInput = document.createElement("input");
    tempInput.style.position = "absolute";
    tempInput.style.left = "-9999px";
    tempInput.value = color;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    alert(`Color ${color} copied to clipboard!`);
  }
});
