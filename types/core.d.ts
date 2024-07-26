import { Bitmap } from "pureimage";
import NodeCache from "node-cache";

interface PlatformAdapter {
  loadImage(
    imageSource: string | HTMLImageElement,
  ): Promise<HTMLImageElement | Bitmap>;
  prepareCanvas(img: HTMLImageElement | Bitmap): {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | any;
  };
}

interface ExtractColorsOptions {
  imageSource: string | HTMLImageElement;
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

  private constructor(adapter: PlatformAdapter);

  static getInstance(adapter: PlatformAdapter): ColorExtractor;

  extractColors(options: ExtractColorsOptions): Promise<ExtractedColorsResult>;

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

export declare class BrowserAdapter implements PlatformAdapter {
  loadImage(imageSource: string | HTMLImageElement): Promise<HTMLImageElement>;
  prepareCanvas(img: HTMLImageElement): {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
  };
}

export declare class NodeAdapter implements PlatformAdapter {
  loadImage(imageSource: string): Promise<Bitmap>;
  prepareCanvas(img: Bitmap): { canvas: any; ctx: any };
}
