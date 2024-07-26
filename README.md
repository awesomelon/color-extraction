# ColorExtractor

ColorExtractor is a utility class for extracting dominant colors from images using k-means clustering. This tool allows you to easily identify and analyze the main colors in any image, making it useful for various applications such as image analysis, design, and data visualization.o.gif)

## Features
- Extract dominant colors from images.
- Filter out similar colors to provide a more distinct color palette.
- Supports multiple image formats (PNG, JPG).
- TypeScript support with provided type definitions.

## Installation
To use ColorExtractor, install the required dependencies.

```bash
$ npm install nodejs-color-extraction
```

## Usage
Here is an example of how to use the ColorExtractor class.

```javascript
import { ColorExtractor } from 'nodejs-color-extraction';

async function main() {
    const colorExtractor = ColorExtractor.getInstance();
    const { colors, dominantColor } = await colorExtractor.extractColors({
        imagePath: req.file.path,
        k: 10,
        sampleRate: 0.1,
        onFilterSimilarColors: false,
        useHex: false
    });
  console.log('Extracted Colors:', colors);
  console.log('Dominant Color:', dominantColor);
}

main();
```


## API

### getInstance()
Returns the singleton instance of the ColorExtractor.


### extractColors(options: ExtractColorsOptions)

Extract colors from an image.
- options.imagePath (string): Path to the image file.
- options.k (number, optional): Number of colors to extract (default is 10).
- options.sampleRate (number, optional): Rate of pixel sampling (default is 0.1).
- options.onFilterSimilarColors (boolean, optional): Whether to filter similar colors (default is false).
- options.useHex (boolean, optional): Whether to return colors in HEX format.

Returns a Promise that resolves to an object containing:
- colors (string[]): An array of extracted colors in RGB format.
- dominantColor (string): The most dominant color in RGB format.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

Feel free to adjust any sections or details as needed!