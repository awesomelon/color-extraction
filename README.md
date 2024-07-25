# ColorExtractor

ColorExtractor is a utility class for extracting dominant colors from images using k-means clustering. This tool allows you to easily identify and analyze the main colors in any image, making it useful for various applications such as image analysis, design, and data visualization.o.gif)

## Features
- Extract dominant colors from images.
- Filter out similar colors to provide a more distinct color palette.
- Cache results for faster subsequent processing.
- Supports multiple image formats (PNG, JPG).

## Installation
To use ColorExtractor, install the required dependencies.

```bash
$ npm install nodejs-color-extraction
```

## Usage
Here is an example of how to use the ColorExtractor class.

```javascript
import { ColorExtractor } from ' nodejs-color-extraction';

async function main() {
  const colorExtractor = ColorExtractor.getInstance();
  const result = await colorExtractor.extractColors('path/to/your/image.jpg', 10, 0.1, true);
  console.log('Extracted Colors:', result.colors);
  console.log('Dominant Color:', result.dominantColor);
}

main();
```


## API

### getInstance()
Returns the singleton instance of the ColorExtractor.


### extractColors(imagePath, k = 10, sampleRate = 0.1, onFilterSimilarColors = false)

Extract colors from an image.
- imagePath (string): Path to the image file.
- k (number, optional): Number of colors to extract (default is 10).
- sampleRate (number, optional): Rate of pixel sampling (default is 0.1).
- onFilterSimilarColors (boolean, optional): Whether to filter similar colors (default is false).

Returns a Promise that resolves to an object containing:
- colors (string[]): An array of extracted colors in RGB format.
- dominantColor (string): The most dominant color in RGB format.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

Feel free to adjust any sections or details as needed!