import { loadImage, createCanvas } from "canvas";
import { kmeans } from "ml-kmeans";

/**
 * ColorExtractor class for extracting dominant colors from images.
 */
export class ColorExtractor {
  static instance;
  static cache = new Map();

  /**
   * Get the singleton instance of ColorExtractor.
   * @returns {ColorExtractor} The singleton instance.
   */
  static getInstance() {
    if (!ColorExtractor.instance) {
      ColorExtractor.instance = new ColorExtractor();
    }
    return ColorExtractor.instance;
  }

  /**
   * Extract colors from an image.
   * @param {string} imagePath - Path to the image file.
   * @param {number} [k=10] - Number of colors to extract.
   * @param {number} [sampleRate=0.1] - Rate of pixel sampling.
   * @param {Object} [options={}] - Additional options.
   * @param {number} [options.minColorDifference=20] - Minimum difference between colors.
   * @returns {Promise<{colors: string[], dominantColor: string}>} Extracted colors and dominant color.
   * @throws {Error} If there's an error during extraction.
   */
  async extractColors(imagePath, k = 10, sampleRate = 0.1, options = {}) {
    const { minColorDifference = 20 } = options;

    if (ColorExtractor.cache.has(imagePath)) {
      return ColorExtractor.cache.get(imagePath);
    }

    try {
      const img = await loadImage(imagePath);
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
      const pixels = this._samplePixels(imageData, sampleRate);

      const result = kmeans(pixels, k);
      const colors = this._formatColors(result.centroids);
      const filteredColors = this._filterSimilarColors(colors, minColorDifference);
      const colorRatios = this._calculateColorRatios(result.clusters, k);
      const sortedColors = this._sortColorsByRatio(filteredColors, colorRatios);
      const dominantColor = this._getDominantColor(colorRatios, colors);

      const extractionResult = { colors: sortedColors.map(c => c.rgb), dominantColor };
      ColorExtractor.cache.set(imagePath, extractionResult);

      return extractionResult;
    } catch (error) {
      console.error("Error extracting colors:", error);
      throw new Error(`Failed to extract colors: ${error.message}`);
    }
  }

  _samplePixels(imageData, sampleRate) {
    const pixels = [];
    for (let i = 0; i < imageData.length; i += 4) {
      if (Math.random() < sampleRate) {
        pixels.push([imageData[i], imageData[i + 1], imageData[i + 2]]);
      }
    }
    return pixels;
  }

  _formatColors(centroids) {
    return centroids.map((centroid) => {
      return {
        rgb: `rgb(${Math.round(centroid[0])}, ${Math.round(centroid[1])}, ${Math.round(centroid[2])})`,
        value: centroid,
      };
    });
  }

  _filterSimilarColors(colors, minDifference) {
    return colors.reduce((unique, color) => {
      if (!unique.some(u => this._colorDistance(u.value, color.value) < minDifference)) {
        unique.push(color);
      }
      return unique;
    }, []);
  }

  _colorDistance(c1, c2) {
    return Math.sqrt(
        Math.pow(c1[0] - c2[0], 2) +
        Math.pow(c1[1] - c2[1], 2) +
        Math.pow(c1[2] - c2[2], 2)
    );
  }

  _calculateColorRatios(clusters, k) {
    const clusterSizes = Array(k).fill(0);
    clusters.forEach((clusterIndex) => {
      clusterSizes[clusterIndex]++;
    });
    const total = clusters.length;
    return clusterSizes.map((size) => size / total);
  }

  _sortColorsByRatio(colors, colorRatios) {
    return colors
        .map((color, index) => {
          return { ...color, ratio: colorRatios[index] };
        })
        .sort((a, b) => b.ratio - a.ratio);
  }

  _getDominantColor(colorRatios, colors) {
    const dominantIndex = colorRatios.indexOf(Math.max(...colorRatios));
    return colors[dominantIndex].rgb;
  }
}