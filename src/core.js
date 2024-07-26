import { kmeans } from "ml-kmeans";
import chroma from "chroma-js";

/**
 * ColorExtractor class for extracting dominant colors from images.
 */
export class ColorExtractor {
  static instance;

  constructor(adapter) {
    this.adapter = adapter;
  }

  /**
   * Get the singleton instance of ColorExtractor.
   * @param {PlatformAdapter} adapter - Platform-specific adapter.
   * @returns {ColorExtractor} The singleton instance.
   */
  static getInstance(adapter) {
    if (!ColorExtractor.instance) {
      ColorExtractor.instance = new ColorExtractor(adapter);
    }
    return ColorExtractor.instance;
  }

  /**
   * Extract colors from an image.
   * @param {Object} options - Options for extracting colors.
   * @param {string|HTMLImageElement} options.imageSource - Path to the image file or an HTMLImageElement.
   * @param {number} [options.k=10] - Number of colors to extract.
   * @param {number} [options.sampleRate=0.1] - Rate of pixel sampling.
   * @param {boolean} [options.onFilterSimilarColors=false] - Whether to filter similar colors.
   * @param {boolean} [options.useHex=false] - Whether to return colors in HEX format.
   * @returns {Promise<{colors: string[], dominantColor: string}>} Extracted colors and dominant color.
   */
  async extractColors({
    imageSource,
    k = 10,
    sampleRate = 0.1,
    onFilterSimilarColors = false,
    useHex = false,
  }) {
    try {
      const img = await this.adapter.loadImage(imageSource);
      const { canvas, ctx } = this.adapter.prepareCanvas(img);
      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;
      const pixels = this._systematicSamplePixels(
        imageData,
        canvas.width,
        canvas.height,
        sampleRate,
      );

      const runs = 5;
      let allColors = [];
      for (let i = 0; i < runs; i++) {
        const result = kmeans(pixels, k, { seed: 42 });
        const colors = this._formatColors(result.centroids, useHex);
        // NOTE: Filter Similar Colors
        if (onFilterSimilarColors) {
          const colorRatios = this._calculateColorRatios(result.clusters, k);
          const filteredColors = this._filterSimilarColors(colors, colorRatios);
          allColors.push(...filteredColors);
        } else {
          allColors.push(...colors);
        }
      }

      const stabilizedColors = this._stabilizeColors(allColors);
      const sortedColors = this._sortColorsByRatio(stabilizedColors);
      const dominantColor = this._getDominantColor(sortedColors);

      const colors = sortedColors.slice(1).map((c) => c.rgb);

      return { colors, dominantColor };
    } catch (error) {
      console.error("Error extracting colors:", error);
      throw error;
    }
  }

  /**
   * Systematically sample pixels from image data.
   * @param {Uint8ClampedArray} imageData - Raw image data.
   * @param {number} width - Image width.
   * @param {number} height - Image height.
   * @param {number} sampleRate - Rate of pixel sampling.
   * @returns {number[][]} Sampled pixels.
   * @private
   */
  _systematicSamplePixels(imageData, width, height, sampleRate) {
    const pixels = [];
    const step = Math.round(1 / sampleRate);
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const i = (y * width + x) * 4;
        if (i + 2 < imageData.length) {
          pixels.push([imageData[i], imageData[i + 1], imageData[i + 2]]);
        }
      }
    }
    return pixels;
  }

  /**
   * Format color centroids.
   * @param {number[][]} centroids - Color centroids.
   * @param {boolean} useHex - Whether to use HEX format.
   * @returns {{rgb: string, value: number[]}[]} Formatted colors.
   * @private
   */
  _formatColors(centroids, useHex) {
    return centroids.map((centroid) => {
      const rgb = `rgb(${Math.round(centroid[0])}, ${Math.round(centroid[1])}, ${Math.round(centroid[2])})`;
      const hex = chroma(rgb).hex();
      return {
        rgb: useHex ? hex : rgb,
        value: centroid,
      };
    });
  }

  /**
   * Calculate color ratios.
   * @param {number[]} clusters - Cluster assignments.
   * @param {number} k - Number of clusters.
   * @returns {number[]} Color ratios.
   * @private
   */
  _calculateColorRatios(clusters, k) {
    const clusterSizes = Array(k).fill(0);
    clusters.forEach((clusterIndex) => {
      clusterSizes[clusterIndex]++;
    });
    const total = clusters.length;
    return clusterSizes.map((size) => size / total);
  }

  /**
   * Filter similar colors.
   * @param {{rgb: string, value: number[]}[]} colors - Formatted colors.
   * @param {number[]} colorRatios - Color ratios.
   * @returns {{rgb: string, value: number[], ratio: number}[]} Filtered colors.
   * @private
   */
  _filterSimilarColors(colors, colorRatios) {
    const filteredColors = [];
    const colorThreshold = 20;

    colors.forEach((color, index) => {
      const similarColorIndex = filteredColors.findIndex(
        (existingColor) =>
          chroma.deltaE(color.rgb, existingColor.rgb) < colorThreshold,
      );

      if (similarColorIndex === -1) {
        filteredColors.push({ ...color, ratio: colorRatios[index] });
      } else {
        filteredColors[similarColorIndex].ratio += colorRatios[index];
      }
    });

    return filteredColors;
  }

  /**
   * Stabilize colors from multiple runs.
   * @param {{rgb: string, value: number[], ratio: number}[]} allColors - All extracted colors.
   * @returns {(*&{ratio})[]} Stabilized colors.
   * @private
   */
  _stabilizeColors(allColors) {
    const colorMap = new Map();
    allColors.forEach((color) => {
      const key = color.rgb;
      if (!colorMap.has(key)) {
        colorMap.set(key, { ...color, count: 1 });
      } else {
        const existing = colorMap.get(key);
        existing.ratio += color.ratio;
        existing.count += 1;
      }
    });

    return Array.from(colorMap.values()).map((color) => ({
      ...color,
      ratio: color.ratio / color.count,
    }));
  }

  /**
   * Sort colors by ratio and perceived brightness.
   * @param {{rgb: string, value: number[], ratio: number}[]} colors - Formatted colors with ratios.
   * @returns {{rgb: string, value: number[], ratio: number}[]} Sorted colors.
   * @private
   */
  _sortColorsByRatio(colors) {
    return colors.sort(
      (a, b) =>
        b.ratio - a.ratio ||
        chroma(b.rgb).luminance() - chroma(a.rgb).luminance(),
    );
  }

  /**
   * Get the dominant color.
   * @param {{rgb: string, value: number[], ratio: number}[]} sortedColors - Sorted colors.
   * @returns {string} Dominant color.
   */
  _getDominantColor(sortedColors) {
    return sortedColors[0].rgb;
  }
}
