# WebEngine

WebEngine is a browser-based JavaScript game engine and code playground. It features a live code editor (powered by CodeMirror), a rendering canvas, and a simple API for drawing and input handling. The project is designed with simplicity and rapid prototyping in mind.

## Features

- **Live code editor** with syntax highlighting and line numbers
- **Immediate code execution** (Run/Stop buttons)
- **Drawing API**: Draw rectangles, circles, text, and images on the canvas
- **Input manager**: Keyboard and mouse input abstraction
- **Persistent editor**: Code is saved with no hassle

## Getting Started

1. **Open `Index.html` in your browser.**
2. Write or modify game code in the editor area.
3. Click **Run** to execute your code.
4. Use the provided API to interact with the canvas and input.

## API Reference
[See Here](https://ji8sw.github.io/WebEngine/API.html)

## Example
```javascript
Game.Print("Welcome to WebEngine!"); // Prints to the browser console
Game.DrawMode = DrawMode_Centered // rects will be drawn centered, as opposted to drawing from top left to bottom right, time saver

let PlayerX = Game.Width / 2 // Width & Height are based on the web canvas
let PlayerY = Game.Height / 2
let PlayerMoveSpeed = 50
let CursorRotation = 0

let Photo = Game.LoadImage("https://ipfs.io/ipfs/QmZm1nZPpACjmf5MjUYAMXYsN9b6yAKzbvCv6WjDgJKLDp") // loads the image from the url, will only actually be drawn when its downloaded
let TitleGradient = Game.CreateLinearGradient(0, 70, 70, 0,
[
    { offset: 0, color: "white" },
    { offset: 1, color: "green" }
]);

Game.Update = function()
{
  	let PlayerXDelta = 0; // the change in this frame
  	let PlayerYDelta = 0;
  
  	if (Game.IsKeyDown("W")) PlayerYDelta -= (PlayerMoveSpeed * Game.DeltaTime); // delta time to keep it consistent irrelative of framerate
    if (Game.IsKeyDown("S")) PlayerYDelta += (PlayerMoveSpeed * Game.DeltaTime);
  	if (Game.IsKeyDown("A")) PlayerXDelta -= (PlayerMoveSpeed * Game.DeltaTime);
    if (Game.IsKeyDown("D")) PlayerXDelta += (PlayerMoveSpeed * Game.DeltaTime);
  
  	CursorRotation += 50 * Game.DeltaTime;
  	
  	Math.clamp(PlayerXDelta, -PlayerMoveSpeed, PlayerMoveSpeed); // so diagonal movement is not faster
  	Math.clamp(PlayerYDelta, -PlayerMoveSpeed, PlayerMoveSpeed);
  
  	PlayerX += PlayerXDelta;
  	PlayerY += PlayerYDelta;

	Game.Clear();
  
    Game.DrawImage(Photo, Game.Width - 100, Game.Height - 100, 200, 200);
  
  	Game.DrawRect(Game.Mouse.X, Game.Mouse.Y, 10, 10, "white", CursorRotation); // follows the mouse cursor, no colour specified so it defaults to Game.DrawColour
	Game.DrawCircle(PlayerX, PlayerY, 10, "white"); // draws a red circle, 10px radius at the player position
  	Game.DrawText("WebEngine Example", Game.Width / 2, 24, TitleGradient); // pretty explanatory, draws text at the center top of the screen, default font size is 16 so we go down 16 and a bit
  
  	Game.DrawText("Copyright 2077", Game.Width / 2, Game.Height - 54, "purple", CursorRotation);
}
```

## Security Note
User code runs in the browser and has access to browser APIs. For public deployments, consider sandboxing or restricting available APIs.

## License
MIT License