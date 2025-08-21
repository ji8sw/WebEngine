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

### Drawing
- `Game.DrawColour` (the default draw colour if none was provided in the following functions)
- `Game.DrawRect(X, Y, Width, Height, Colour = Game.DrawColour, Rotation = 0)`
- `Game.DrawCircle(X, Y, Radius, Colour = Game.DrawColour, Rotation = 0)`
- `Game.DrawText(Text, X, Y, Colour = Game.DrawColour, Rotation = 0)`
- `Game.DrawImage(Image, X, Y, Width = Image.naturalWidth, Height = Image.naturalHeight, Rotation = 0)`
- `Game.Clear(ClearColour = Transparent)` (clears the canvas, with an optional background colour, or transparent)
- `Game.Width`, `Game.Height` (canvas size)
- `Image Game.LoadImage(URL)` (ensure your image's host allows cross origin requests)
- `Gradient Game.CreateLinearGradient(x0, y0, x1, y1, ColourStops)`
- `Gradient Game.CreateRadialGradient(x0, y0, r0, x1, y1, r1, ColourStops)` (to understand more about the gradient functions, [read here](https://www.w3schools.com/jsref/canvas_createlineargradient.asp))

### Input
- `Game.IsKeyDown(Key)` — returns `true` if the key is pressed (case-insensitive) (for example: "w" or "F")
- `Game.Mouse.X`, `Game.Mouse.Y` — mouse position on canvas
- `Game.Mouse.Down` — mouse button state

### Game Loop
- Define `Game.Update = function() { ... }` in your code. This function is called every frame.
- Use `Game.DeltaTime` for frame-rate independent movement.

### Utility
- `Game.Print(text)` — prints to the browser console
- `Game.SetCanvasSize(Width, Height)` — Sets the canvas size, not recommended unless you need it, resets on reload
- `Math.clamp(value, min, max)` — clamps a value between min and max

### Notes
- `Colour` - Colour in draw functions can be either a colour name, like "red", or a gradient recieved from ...

## Example
```javascript
Game.Print("Welcome to WebEngine!"); // Prints to the browser console
Game.DrawMode = DrawMode_Centered // rects will be drawn centered, as opposted to drawing from top left to bottom right, time saver

let PlayerX = Game.Width / 2 // Width & Height are based on the web canvas
let PlayerY = Game.Height / 2
let PlayerMoveSpeed = 50
let CursorRotation = 0

let Photo = Game.LoadImage("https://media.discordapp.net/attachments/1325358285678837853/1394544520837861416/IMG_7311.jpg?ex=68a7f9cb&is=68a6a84b&hm=5caf54871122602e69be9916d6a79fd750953c4a331d61e48e63332ff73c0bf0&=&format=webp&width=625&height=937") // loads the image from the url, will only actually be drawn when its downloaded

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
  
    Game.DrawImage(Photo, Game.Width / 2, Game.Height / 2, 400, 400);
  
  	Game.DrawRect(Game.Mouse.X, Game.Mouse.Y, 10, 10, "white", CursorRotation); // follows the mouse cursor, no colour specified so it defaults to Game.DrawColour
	Game.DrawCircle(PlayerX, PlayerY, 10, "red"); // draws a red circle, 10px radius at the player position
  	Game.DrawText("WebEngine Example", Game.Width / 2, 24); // pretty explanatory, draws text at the center top of the screen, default font size is 16 so we go down 16 and a bit
  
  	Game.DrawText("Copyright 2077", Game.Width / 2, Game.Height - 54, "purple", CursorRotation);
}
```

## Security Note
User code runs in the browser and has access to browser APIs. For public deployments, consider sandboxing or restricting available APIs.

## License
MIT License