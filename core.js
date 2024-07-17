import { loadImage, createCanvas } from "canvas";
import { kmeans } from "ml-kmeans";

export class ColorExtractor {
  static instance;

  static getInstance() {
    if (!ColorExtractor.instance) {
      ColorExtractor.instance = new ColorExtractor();
    }

    return ColorExtractor.instance;
  }

  async extractColors(imagePath, k = 10, sampleRate = 0.1) {
    try {
      const img = await loadImage(imagePath);
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
      const pixels = this._samplePixels(imageData, sampleRate);

      const result = kmeans(pixels, k);
      const colors = this._formatColors(result.centroids);
      const colorRatios = this._calculateColorRatios(result.clusters, k);
      const sortedColors = this._sortColorsByRatio(colors, colorRatios);
      const dominantColor = this._getDominantColor(colorRatios, colors);

      return { colors: sortedColors, dominantColor };
    } catch (error) {
      console.error("Error extracting colors:", error);
      throw error;
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
      .sort((a, b) => b.ratio - a.ratio)
      .map((color) => color.rgb);
  }

  _getDominantColor(colorRatios, colors) {
    const dominantIndex = colorRatios.indexOf(Math.max(...colorRatios));
    return colors[dominantIndex].rgb;
  }
}
