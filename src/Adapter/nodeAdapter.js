import pureimage from "pureimage";
import fs from "fs";
import sharp from "sharp";
import tempfile from "tempfile";

/**
 * NodeAdapter class for handling image operations in a Node.js environment.
 */
export class NodeAdapter {
  /**
   * Load an image from a file path.
   * @param {string} imageSource - The path to the image file.
   * @returns {Promise<Object>} - A promise that resolves to a decoded image object.
   */
  async loadImage(imageSource) {
    const tempImagePath = await this._convertToPNG(imageSource);
    const stream = fs.createReadStream(tempImagePath);

    try {
      return await pureimage.decodePNGFromStream(stream);
    } catch (error) {
      console.error(`Error loading image from path: ${imageSource}`, error);
      throw new Error(
          "Failed to load image. Please ensure the file is not corrupted and is in PNG or JPG format.",
      );
    }
  }

  /**
   * Convert an image to PNG format.
   * @param {string} imageSource - The path to the image file.
   * @returns {Promise<string>} - A promise that resolves to the path of the converted PNG image.
   * @private
   */
  async _convertToPNG(imageSource) {
    const pngImagePath = tempfile({ extension: "png" });
    await sharp(imageSource).png().toFile(pngImagePath);
    return pngImagePath;
  }

  /**
   * Prepare a canvas for image processing.
   * @param {Object} img - The loaded image object.
   * @returns {{canvas: Object, ctx: Object}} - An object containing the canvas and its 2D context.
   */
  prepareCanvas(img) {
    const maxSize = 1000;
    let { width, height } = img;

    if (width > maxSize || height > maxSize) {
      const ratio = Math.min(maxSize / width, maxSize / height);
      width = Math.floor(width * ratio);
      height = Math.floor(height * ratio);
    }

    const canvas = pureimage.make(width, height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    return { canvas, ctx };
  }
}
