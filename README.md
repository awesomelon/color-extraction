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
$ npm install simply-color-extraction
```

## Usage
Here is an example of how to use the ColorExtractor class.


### Client

```javascript
import { ColorExtractor } from "simply-color-extraction";
import { BrowserAdapter } from "simply-color-extraction/browserAdapter";

const file = event.target.files[0];
if (file) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
        const adapter = new BrowserAdapter();
        const colorExtractor = ColorExtractor.getInstance(adapter);
        const { colors, dominantColor } = await colorExtractor.extractColors({
            imageSource: img,
            k: 10,
            sampleRate: 0.1,
            onFilterSimilarColors: false,
            useHex: true,
        });
        console.log("Extracted Colors:", colors);
        console.log("Dominant Color:", dominantColor);
    };
}
```

### Server

```javascript
import multer from "multer";
import { ColorExtractor } from "simply-color-extraction";
import { NodeAdapter } from "simply-color-extraction/nodeAdapter";

function initMulter(uploadDir) {
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, uploadDir);
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + path.extname(file.originalname)); // 파일 확장자를 유지
            },
        }),
    });
}

const upload = initMulter('uploads');

app.post("/upload", upload.single("image"), async (req, res) => {
    try {
        const adapter = new NodeAdapter();
        const colorExtractor = ColorExtractor.getInstance(adapter);
        const { colors, dominantColor } = await colorExtractor.extractColors({
            imageSource: req.file.path,
            k: 10,
            sampleRate: 0.1,
            onFilterSimilarColors: false,
            useHex: true,
        });
        res.json({ colors, dominantColor });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Error processing image");
    }
});
```


## API

### getInstance()
Returns the singleton instance of the ColorExtractor.


### extractColors(options: ExtractColorsOptions)

Extract colors from an image.
- options.imageSource (string | HTMLImageElement): Path to the image file.
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