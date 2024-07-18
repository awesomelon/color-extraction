# ColorExtractor

ColorExtractor is a JavaScript class for extracting dominant colors from images. It uses the k-means clustering algorithm to identify the dominant color and other major colors in an image.

## Features

- Extract main colors from images
- Identify the dominant color
- Performance optimization through caching
- Resizing for large image processing
- Similar color filtering
- Multiple runs and stabilization for consistent results
- Clustering using K-Means algorithm

## Installation

To use this project, you need to install the following packages:

```bash
$ npm install pureimage ml-kmeans node-cache chroma-js
```

## Usage
```javascript
import { ColorExtractor } from './path-to-color-extractor';

const extractor = ColorExtractor.getInstance();

async function extractColors() {
  try {
    const result = await extractor.extractColors('path/to/your/image.jpg');
    console.log('Dominant Color:', result.dominantColor);
    console.log('Other Colors:', result.colors);
  } catch (error) {
    console.error('Error extracting colors:', error);
  }
}

extractColors();
```

## API

`ColorExtractor.getInstance()`

Returns the singleton instance of ColorExtractor.

`extractColors(imagePath, k = 10, sampleRate = 0.1)`


### Extracts colors from the specified image.
- `imagePath` (string): Path to the image file
- `k` (number, optional): Number of colors to extract. Default is 10
- `sampleRate` (number, optional): Pixel sampling rate. Default is 0.1

Returns: `Promise<{colors: string[], dominantColor: string}>`
- `colors`: List of extracted colors excluding the dominant color (array of RGB format strings)
- `dominantColor`: The most dominant color (RGB format string)

## Notes
- This library is designed to be used in a Node.js environment.
- Be mindful of memory usage when processing large images.
- The process includes multiple runs and result stabilization for consistency, which may increase processing time.
- Clustering of colors is performed using the K-Means algorithm, which helps in accurately identifying and grouping similar colors.
- The library uses caching (via node-cache) to store results temporarily for improved performance. Cached results are stored for 1 hour by default.

## License
This project is distributed under the MIT License.
> This README.md file provides an overview of the ColorExtractor class, including its main features, installation instructions, usage example, API description, and important notes. You can modify or expand this content based on the actual structure of your project or any additional configurations.