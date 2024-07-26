/**
 * BrowserAdapter class for handling image operations in a browser environment.
 */
export class BrowserAdapter {
  /**
   * Load an image from a URL or an HTMLImageElement.
   * @param {string|HTMLImageElement} imageSource - The URL of the image or an HTMLImageElement.
   * @returns {Promise<HTMLImageElement>} - A promise that resolves to a loaded HTMLImageElement.
   */
  async loadImage(imageSource) {
    return new Promise((resolve, reject) => {
      if (typeof imageSource === "string") {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageSource;
        img.onload = () => resolve(img);
        img.onerror = reject;
      } else if (imageSource instanceof HTMLImageElement) {
        resolve(imageSource);
      } else {
        reject(new Error("Invalid image source"));
      }
    });
  }

  /**
   * Prepare a canvas for image processing.
   * @param {HTMLImageElement} img - The loaded HTMLImageElement.
   * @returns {{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}} - An object containing the canvas and its 2D context.
   */
  prepareCanvas(img) {
    const maxSize = 1000;
    let { width, height } = img;

    if (width > maxSize || height > maxSize) {
      const ratio = Math.min(maxSize / width, maxSize / height);
      width = Math.floor(width * ratio);
      height = Math.floor(height * ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    return { canvas, ctx };
  }
}
