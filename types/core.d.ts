import { Bitmap } from "pureimage";
import NodeCache from "node-cache";

interface ExtractColorsOptions {
  imagePath: string;
  k?: number;
  sampleRate?: number;
  onFilterSimilarColors?: boolean;
  useHex?: boolean;
}

interface Color {
  rgb: string;
  value: number[];
  ratio?: number;
  count?: number;
}

interface ExtractedColorsResult {
  colors: string[];
  dominantColor: string;
}

export declare class ColorExtractor {
  private static instance: ColorExtractor;
  private static cache: NodeCache;

  private constructor();

  static getInstance(): ColorExtractor;

  extractColors(options: ExtractColorsOptions): Promise<ExtractedColorsResult>;

  private _convertToPNG(imagePath: string): Promise<string>;
  private _loadImage(imagePath: string): Promise<Bitmap>;
  private _prepareCanvas(img: Bitmap): { canvas: any; ctx: any };
  private _systematicSamplePixels(
    imageData: Uint8ClampedArray,
    width: number,
    height: number,
    sampleRate: number,
  ): number[][];
  private _formatColors(
    centroids: number[][],
    useHex: boolean,
  ): { rgb: string; value: number[] }[];
  private _calculateColorRatios(clusters: number[], k: number): number[];
  private _filterSimilarColors(
    colors: { rgb: string; value: number[] }[],
    colorRatios: number[],
  ): Color[];
  private _stabilizeColors(allColors: Color[]): Color[];
  private _sortColorsByRatio(colors: Color[]): Color[];
  private _getDominantColor(sortedColors: Color[], useHex: boolean): string;
}
