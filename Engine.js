const Canvas = document.getElementById("GameCanvas")
const CTX = Canvas.getContext("2d")

const DrawMode_Centered = 0;
const DrawMode_TopLeft = 1;

let GameAPI = {};
GameAPI.DrawMode = DrawMode_Centered;
GameAPI.Height = Canvas.height;
GameAPI.Width = Canvas.width;
GameAPI.DeltaTime = 0;

GameAPI.KeysDown = {};
GameAPI.Mouse = { X: 0, Y: 0, Down: false };

GameAPI.Print = function(Text) { console.log(Text); };

GameAPI.Clear = function() { CTX.clearRect(0, 0, Canvas.width, Canvas.height); };
GameAPI.DrawColour = "white";

let FrameHandle = null;

GameAPI.DrawRect = function(X, Y, Width, Height, Colour) 
{
    if (typeof Colour === "undefined") Colour = GameAPI.DrawColour;

    if (GameAPI.DrawMode === DrawMode_Centered)
    {
        // Adjust X and Y to center the rectangle
        X -= Width / 2;
        Y -= Height / 2;
    }

    CTX.fillStyle = Colour;
    CTX.fillRect(X, Y, Width, Height);
}

GameAPI.DrawCircle = function(X, Y, Radius, Colour) 
{
    if (typeof Colour === "undefined") Colour = GameAPI.DrawColour;

    CTX.fillStyle = Colour;
    CTX.beginPath();
    CTX.arc(X, Y, Radius, 0, Math.PI * 2);
    CTX.fill();
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