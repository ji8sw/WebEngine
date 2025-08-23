# WebEngine

WebEngine is a browser-based JavaScript game engine and code playground. It features a live code editor (powered by CodeMirror), a rendering canvas, and an API for drawing and input handling. The project is designed with simplicity and rapid prototyping in mind.

WebEngine is capable of 2D physics via [Matter.js](https://brm.io/matter-js/docs/).

## Features

- **Live code editor** with syntax highlighting, line numbers and autocomplete
- **Immediate code execution** (Run/Stop buttons)
- **Drawing API**: Draw rectangles, circles, text, and images on the canvas
- **Input manager**: Keyboard and mouse/touch input abstraction
- **Persistent editor**: Code is saved with no hassle

## Getting Started

1. **Open `Index.html` in your browser.**
2. Write or modify game code in the editor area.
3. Click **Run** to execute your code.
4. Use the provided API to interact with the canvas and input.

When programming you will have full access to the DOM and browser APIs, do with it what you will.

When programming you will have full access to Matter.js's API, a physics world and engine instance is stored in the `Game` object, read more in the [API Reference](https://ji8sw.github.io/WebEngine/API.html).

I highly recommend you read the engine code itself to understand the fully capabilities of the engine.

## API Reference
[See Here](https://ji8sw.github.io/WebEngine/API.html)

## Examples
See a list of example scripts [here](https://github.com/ji8sw/WebEngine/blob/main/Examples/Examples.md)

## Security Note
User code runs in the browser and has access to browser APIs. For public deployments, consider sandboxing or restricting available APIs.

## License
MIT License