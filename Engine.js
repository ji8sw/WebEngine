const Canvas = document.getElementById("GameCanvas")
const CTX = Canvas.getContext("2d")

const DrawMode_Centered = 0;
const DrawMode_TopLeft = 1;

let GameAPI = {};
GameAPI.DrawMode = DrawMode_Centered;
GameAPI.Height = Canvas.height;
GameAPI.Width = Canvas.width;
GameAPI.DeltaTime = 0;
GameAPI.Font = "16px Arial";

GameAPI.KeysDown = {};
GameAPI.Mouse = { X: 0, Y: 0, Down: false };

GameAPI.Print = function(Text) { console.log(Text); };

GameAPI.Clear = function() { CTX.clearRect(0, 0, Canvas.width, Canvas.height); };
GameAPI.DrawColour = "white";

let FrameHandle = null;

GameAPI.DrawRect = function(X, Y, Width, Height, Colour, Rotation = 0) 
{
    if (typeof Colour === "undefined") Colour = GameAPI.DrawColour;

    if (GameAPI.DrawMode === DrawMode_Centered)
    {
        // Adjust X and Y to center the rectangle
        X -= Width / 2;
        Y -= Height / 2;
    }

    CTX.save(); // Save the current context state
    CTX.translate(X + Width / 2, Y + Height / 2); // Move the origin to the center of the rectangle
    CTX.rotate(Rotation * Math.PI / 180); // Convert degrees to radians
    CTX.fillStyle = Colour;
    CTX.fillRect(-Width / 2, -Height / 2, Width, Height);
    CTX.restore(); // Restore the context to its previous state
}

GameAPI.DrawCircle = function(X, Y, Radius, Colour, Rotation = 0) 
{
    if (typeof Colour === "undefined") Colour = GameAPI.DrawColour;

    CTX.save(); // Save the current context state
    CTX.translate(X, Y);
    CTX.rotate(Rotation * Math.PI / 180); // Convert degrees to radians
    CTX.fillStyle = Colour;
    CTX.beginPath();
    CTX.arc(0, 0, Radius, 0, Math.PI * 2);
    CTX.fill();
    CTX.restore(); // Restore the context to its previous state
}

GameAPI.DrawText = function(Text, X, Y, Colour, Rotation = 0) 
{
    if (typeof Colour === "undefined") Colour = GameAPI.DrawColour;

    CTX.save(); // Save the current context state
    CTX.translate(X, Y);
    CTX.rotate(Rotation * Math.PI / 180); // Convert degrees to radians
    CTX.fillStyle = Colour;
    CTX.font = GameAPI.Font;
    if (GameAPI.DrawMode === DrawMode_Centered) CTX.textAlign = "center";
    else CTX.textAlign = "left";
    CTX.fillText(Text, 0, 0);
    CTX.restore(); // Restore the context to its previous state
}

GameAPI.DrawImage = function(Image, X, Y, Width, Height, Rotation = 0) 
{
    if (!Image.complete || Image.naturalWidth === 0)
        return; // Ensure the image is loaded

    if (typeof Width === "undefined") Width = Image.naturalWidth;
    if (typeof Height === "undefined") Height = Image.naturalHeight;

    CTX.save(); // Save the current context state
    CTX.translate(X, Y);
    CTX.rotate(Rotation * Math.PI / 180); // Convert degrees to radians
    
    let DrawX = (GameAPI.DrawMode === DrawMode_Centered) ? -Width / 2 : 0
    let DrawY = (GameAPI.DrawMode === DrawMode_Centered) ? -Height / 2 : 0

    CTX.drawImage(Image, DrawX, DrawY, Width, Height);
    CTX.restore(); // Restore the context to its previous state
}

GameAPI.LoadImage = function(URL)
{
    let NewImage = new Image();
    NewImage.crossOrigin = "Anonymous"; // Allow cross-origin images
    NewImage.src = URL;
    return NewImage;
}

async function LoadGameCode(Code)
{
    if (FrameHandle || !GameAPI.Running)
    {
        cancelAnimationFrame(FrameHandle);
        FrameHandle = null;
    }
    
    GameAPI.Running = true;
    new Function("Game", Code)(GameAPI);
    let LastTime = performance.now();

    function Loop()
    {
        if (!GameAPI.Running) return;

        const Now = performance.now();
        GameAPI.DeltaTime = (Now - LastTime) / 1000; // seconds
        LastTime = Now;

        if (typeof GameAPI.Update === "function") GameAPI.Update();
        FrameHandle = requestAnimationFrame(Loop);
    }
    Loop();
}

document.addEventListener("keydown", Event => 
{
    if (Event.key === "F1")
    {
        let Code = Editor.getValue();
        LoadGameCode(Code);
    }
});

document.addEventListener("DOMContentLoaded", () => 
{
    document.getElementById("RunButton").addEventListener("click", () => 
    {
        let Code = Editor.getValue();
        LoadGameCode(Code);
    });

    document.getElementById("StopButton").addEventListener("click", () => 
    {
        GameAPI.Running = false;
    });
});

// Input

window.addEventListener("keydown", Event => 
{
    GameAPI.KeysDown[Event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", Event => 
{
    GameAPI.KeysDown[Event.key.toLowerCase()] = false;
});

Canvas.addEventListener("mousemove", Event => 
{
    const Rect = Canvas.getBoundingClientRect();
    GameAPI.Mouse.X = Event.clientX - Rect.left;
    GameAPI.Mouse.Y = Event.clientY - Rect.top;
});

Canvas.addEventListener("mousedown", () => 
{
    GameAPI.Mouse.Down = true;
});

Canvas.addEventListener("mouseup", () => 
{
    GameAPI.Mouse.Down = false;
});

GameAPI.IsKeyDown = function(Key) 
{
    return !!GameAPI.KeysDown[Key.toLowerCase()];
};

Math.clamp = function(Value, Min, Max)
{
    return Math.max(Min, Math.min(Max, Value));
}