const Canvas = document.getElementById("GameCanvas")
const CTX = Canvas.getContext("2d")

const DrawMode_Centered = 0;
const DrawMode_TopLeft = 1;

let Game = {};
Game.DrawMode = DrawMode_Centered;
Game.Height = Canvas.height;
Game.Width = Canvas.width;
Game.DeltaTime = 0;
Game.Font = "16px Arial";
Game.AudioSources = [];

Game.KeysDown = {};
Game.Mouse = { X: 0, Y: 0, Down: false };

Game.Print = function(Text) { console.log(Text); };

Game.Clear = function(ClearColour = undefined) 
{
    if (typeof ClearColour === "undefined") ClearColour = CTX.clearRect(0, 0, Canvas.width, Canvas.height);
    else
    {
        CTX.save();
        CTX.fillStyle = ClearColour;
        CTX.fillRect(0, 0, Canvas.width, Canvas.height);
        CTX.restore();
    }
}
Game.DrawColour = "white";

let FrameHandle = null;

Game.DrawRect = function(X, Y, Width, Height, Colour, Rotation = 0) 
{
    if (typeof Colour === "undefined") Colour = Game.DrawColour;

    if (Game.DrawMode === DrawMode_Centered)
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

Game.DrawCircle = function(X, Y, Radius, Colour, Rotation = 0) 
{
    if (typeof Colour == undefined) Colour = Game.DrawColour;

    CTX.save(); // Save the current context state
    CTX.translate(X, Y);
    CTX.rotate(Rotation * Math.PI / 180); // Convert degrees to radians
    CTX.fillStyle = Colour;
    CTX.beginPath();
    CTX.arc(0, 0, Radius, 0, Math.PI * 2);
    CTX.fill();
    CTX.restore(); // Restore the context to its previous state
}

Game.DrawText = function(Text, X, Y, Colour, Rotation = 0) 
{
    if (typeof Colour === "undefined") Colour = Game.DrawColour;

    CTX.save(); // Save the current context state
    CTX.translate(X, Y);
    CTX.rotate(Rotation * Math.PI / 180); // Convert degrees to radians
    CTX.fillStyle = Colour;
    CTX.font = Game.Font;
    if (Game.DrawMode === DrawMode_Centered) CTX.textAlign = "center";
    else CTX.textAlign = "left";
    CTX.fillText(Text, 0, 0);
    CTX.restore(); // Restore the context to its previous state
}

Game.DrawImage = function(Image, X, Y, Width, Height, Rotation = 0) 
{
    if (!Image.complete || Image.naturalWidth === 0)
        return; // Ensure the image is loaded

    if (typeof Width === "undefined") Width = Image.naturalWidth;
    if (typeof Height === "undefined") Height = Image.naturalHeight;

    CTX.save(); // Save the current context state
    CTX.translate(X, Y);
    CTX.rotate(Rotation * Math.PI / 180); // Convert degrees to radians
    
    let DrawX = (Game.DrawMode === DrawMode_Centered) ? -Width / 2 : 0
    let DrawY = (Game.DrawMode === DrawMode_Centered) ? -Height / 2 : 0

    CTX.drawImage(Image, DrawX, DrawY, Width, Height);
    CTX.restore(); // Restore the context to its previous state
}

Game.SetCanvasSize = function(Width, Height)
{
    Canvas.width = Width;
    Canvas.height = Height;
    Game.Width = Width;
    Game.Height = Height;
}

Game.LoadImage = function(URL)
{
    let NewImage = new Image();
    NewImage.crossOrigin = "Anonymous"; // Allow cross-origin images
    NewImage.src = URL;
    return NewImage;
}

Game.AsyncLoadImage = function(URL)
{
    return new Promise((Res, Rej) => 
    {
        let NewImage = new Image()
        NewImage.crossOrigin = "Anonymous"
        NewImage.onload = () => Res(NewImage)
        NewImage.onerror = () => Rej(new Error("Failed to load image: " + URL))
        NewImage.src = URL
    })
}

Game.AsyncLoadAudio = async function(URL, Play = true)
{
    let Context = new AudioContext();
    return fetch(URL).then(Response => Response.arrayBuffer())
        .then(ArrayBuffer => Context.decodeAudioData(ArrayBuffer))
        .then(AudioBuffer => 
        {
            let Source = Context.createBufferSource();
            Source.buffer = AudioBuffer;
            Source.connect(Context.destination);
            if (Play) Source.start();
            Game.AudioSources.push(Source);
            return Source;
        });
}

Game.StopAllAudio = function()
{
    Game.AudioSources.forEach(Source => 
    {
        Source.stop();
        Source.disconnect();
    });
    Game.AudioSources = [];
}

Game.CreateLinearGradient = function(x0, y0, x1, y1, ColourStops) 
{
    let Gradient = CTX.createLinearGradient(x0, y0, x1, y1);
    ColourStops.forEach(Stop => Gradient.addColorStop(Stop.offset, Stop.color));
    return Gradient;
}

Game.CreateRadialGradient = function(x0, y0, r0, x1, y1, r1, ColourStops) 
{
    let Gradient = CTX.createRadialGradient(x0, y0, r0, x1, y1, r1);
    ColourStops.forEach(Stop => Gradient.addColorStop(Stop.offset, Stop.color));
    return Gradient;
}

Game.Require = function(ScriptID)
{
    if (!Editors[ScriptID])
    {
        console.error(`Script ${ScriptID} not found in editors.`);
        return;
    }

    let Code = Editors[ScriptID].getValue();
    if (!Code) console.error(`Script ${ScriptID} is empty or not found.`);
    try
    {
        (0, eval)(Code);
    } 
    catch (Error)
    {
        console.error(`Error running script ${ScriptID}:`, Error);
    }
}

async function LoadGameCode(Code)
{
    if (FrameHandle || !Game.Running)
    {
        cancelAnimationFrame(FrameHandle);
        FrameHandle = null;
    }

    Game.SetCanvasSize(800, 600); // Reset canvas size

    // initialize matter physics
    Game.PhysEngine = Matter.Engine.create()
	Game.PhysWorld = Game.PhysEngine.world
	Game.PhysRunner = Matter.Runner.create()
	Matter.Runner.run(Game.PhysRunner, Game.PhysEngine)
    
    Game.Running = true;
    try
    {
        eval(`(async () => {${Code}})();`);
    } 
    catch (Error)
    {
        console.error(`Error running script:`, Error);
    }
    let LastTime = performance.now();

    function Loop()
    {
        if (!Game.Running) return;

        const Now = performance.now();
        Game.DeltaTime = (Now - LastTime) / 1000; // seconds
        LastTime = Now;

        if (typeof Game.Update === "function") Game.Update();
        FrameHandle = requestAnimationFrame(Loop);
    }
    Loop();
}

document.addEventListener("keydown", Event => 
{
    if (Event.key === "F1")
    {
        if (!CurrentEditor) return;

        let Code = CurrentEditor.getValue();
        LoadGameCode(Code);
    }
});

document.addEventListener("DOMContentLoaded", () => 
{
    document.getElementById("RunButton").addEventListener("click", () => 
    {
        if (!CurrentEditor) return;

        let Code = CurrentEditor.getValue();
        LoadGameCode(Code);
    });

    document.getElementById("StopButton").addEventListener("click", () => 
    {
        Game.StopAllAudio();
        Game.Running = false;
    });

    document.getElementById("CopyCanvas").addEventListener("click", () => 
    {
        Canvas.toBlob(async Blob =>
        {
            if (!Blob) return;
            try
            {
                await navigator.clipboard.write([
                    new ClipboardItem({ "image/png": Blob })
                ]);
            }
            catch (Error)
            {
                console.error("Failed to copy canvas image:", Error);
            }
        });
    });

    document.getElementById("SaveGameCode").addEventListener("click", () => 
    {
        for (let Key in Editors) 
        {
            if (Editors.hasOwnProperty(Key)) 
            {
                let Code = Editors[Key].getValue();
                const blob = new Blob([Code], { type: "text/javascript" });
                const url = URL.createObjectURL(blob);

                const Link = document.createElement("a");
                Link.href = url;
                Link.download = Key + ".js";
                Link.click();
                URL.revokeObjectURL(url);
                console.log(`Saved ${Key} to local file.`);
            }
        }
    });

    document.getElementById("LoadGameCode").addEventListener("change", async (Event) => 
    {
        const Files = Event.target.files;

        document.getElementById('Editors').innerHTML = '';
        document.querySelectorAll('#TabBar .TabButton').forEach(Button => Button.remove());

        Editors = {};
        CurrentEditor = null;
        
        let Index = 0;
        for (const File of Files)
        {
            const Text = await File.text();
            Index++;
            var NewID = 'Script_' + Index;

            var NewTab = document.createElement('button');
            NewTab.className = 'TabButton';
            NewTab.textContent = 'Script_' + Index;
            NewTab.setAttribute('data-target', NewID);

            var TabBar = document.getElementById('TabBar');
            var AddTabButton = document.getElementById('AddTabButton');
            TabBar.insertBefore(NewTab, AddTabButton);

            var NewContainer = document.createElement('div');
            NewContainer.id = NewID;
            NewContainer.className = 'EditorContainer';
            var TA = document.createElement('textarea');
            NewContainer.appendChild(TA);
            document.getElementById('Editors').appendChild(NewContainer);

            var CM = CreateEditorFromTextArea(TA);
        
            CM.setValue(Text);
            Editors[NewID] = CM;
        
            CM.on('change', function() 
            {
                localStorage.setItem('Code_' + NewID, CM.getValue());
            });
        
            NewTab.addEventListener('click', function() 
            {
                console.log(`Switched to tab: ${NewID}`);
                document.querySelectorAll('.TabButton').forEach(B => B.classList.remove('Active'));
                NewTab.classList.add('Active');
            
                document.querySelectorAll('.EditorContainer').forEach(Container => Container.classList.remove('Active'));
                NewContainer.classList.add('Active');
            
                CurrentEditor = CM;
                CurrentEditor.refresh();
            });
        
            if (Index === 1) NewTab.click();
        }
    });
});

// Input

window.addEventListener("keydown", Event => 
{
    Game.KeysDown[Event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", Event => 
{
    Game.KeysDown[Event.key.toLowerCase()] = false;
});

Canvas.addEventListener("mousemove", Event => 
{
    const Rect = Canvas.getBoundingClientRect();
    const ScaleX = Canvas.width / Rect.width;
    const ScaleY = Canvas.height / Rect.height;
    Game.Mouse.X = (Event.clientX - Rect.left) * ScaleX;
    Game.Mouse.Y = (Event.clientY - Rect.top) * ScaleY;
});

Canvas.addEventListener("touchmove", Event => 
{
    const Rect = Canvas.getBoundingClientRect();
    const scaleX = Canvas.width / Rect.width;
    const scaleY = Canvas.height / Rect.height;
    const touch = Event.touches[0];
    Game.Mouse.X = (touch.clientX - Rect.left) * scaleX;
    Game.Mouse.Y = (touch.clientY - Rect.top) * scaleY;
});

Canvas.addEventListener("mousedown", () => 
{
    Game.Mouse.Down = true;
});

Canvas.addEventListener("mouseup", () => 
{
    Game.Mouse.Down = false;
});

Canvas.addEventListener("touchstart", Event => 
{
    Game.Mouse.Down = true;
});
Canvas.addEventListener("touchend", Event => 
{
    Game.Mouse.Down = false;
});

Game.IsKeyDown = function(Key) 
{
    return !!Game.KeysDown[Key.toLowerCase()];
};

Math.clamp = function(Value, Min, Max)
{
    return Math.max(Min, Math.min(Max, Value));
}

Math.randomInt = function(max)
{
    return Math.floor(Math.random() * max);
}

Math.randomHexColour = function()
{
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
}

// Editor UI
var Editors = {}
var CurrentEditor = null

function CustomHint(CM) 
{
    let Inner = CodeMirror.hint.javascript(CM) || { list: [] }
    let Anyword = CodeMirror.hint.anyword(CM) || { list: [] }
    
    return {
        list: [...new Set([...Inner.list, ...Anyword.list])],
        from: Inner.from || Anyword.from,
        to: Inner.to || Anyword.to
    }
}

function CreateEditorFromTextArea(TA)
{
    var CM = CodeMirror.fromTextArea(TA, 
    {
        addons: ["closebrackets"],
        lineNumbers: true,
        mode: "javascript",
        theme: "dracula",
        tabSize: 4,
        indentUnit: 4,
        matchBrackets: true,
        autoCloseBrackets: true,
        lineWrapping: true,
        smartIndent: true,
        indentWithTabs: true,
        matchBrackets: true,
        showTrailingSpace: true,
        extraKeys:
        {
            "Ctrl-Space": "autocomplete",
        },
        hintOptions: { hint: CustomHint }
    });

    CM.on("inputRead", function(Instance, Change) 
    {
        if (Change.text[0].match(/\w/)) 
        {
            let Cursor = Instance.getCursor()
            let Token = Instance.getTokenAt(Cursor)
            if (Token.string.length >= 2) 
            {
                Instance.showHint({ completeSingle: false })
            }
        }
    })

    return CM;
}

document.querySelectorAll('.EditorContainer textarea').forEach((TA, Index) => 
{
    var CM = CreateEditorFromTextArea(TA);

    var Key = TA.parentElement.id;
    Editors[Key] = CM;

    var Saved = localStorage.getItem('Code_' + Key);
    if (Saved) CM.setValue(Saved);

    CM.on('change', function() 
    {
        localStorage.setItem('Code_' + Key, CM.getValue());
    });

    if (Index === 0) CurrentEditor = CM;
});

document.querySelectorAll('.TabButton').forEach(Button =>
{
    Button.addEventListener('click', function() 
    {
        document.querySelectorAll('.TabButton').forEach(B => B.classList.remove('Active'));
        Button.classList.add('Active');

        document.querySelectorAll('.EditorContainer').forEach(Container => Container.classList.remove('Active'));
        var Target = Button.getAttribute('data-target');
        document.getElementById(Target).classList.add('Active');

        CurrentEditor = Editors[Target];
        CurrentEditor.refresh();
    });
});

document.getElementById('AddTabButton').addEventListener('click', function() 
{
    var Index = Object.keys(Editors).length + 1;
    var NewID = 'Script_' + Index;

    var NewTab = document.createElement('button');
    NewTab.className = 'TabButton';
    NewTab.textContent = 'Script_' + Index;
    NewTab.setAttribute('data-target', NewID);

    var TabBar = document.getElementById('TabBar');
    var AddTabButton = document.getElementById('AddTabButton');

    TabBar.insertBefore(NewTab, AddTabButton);

    var NewContainer = document.createElement('div');
    NewContainer.id = NewID;
    NewContainer.className = 'EditorContainer';
    var TA = document.createElement('textarea');
    TA.value = '';
    NewContainer.appendChild(TA);
    document.getElementById('Editors').appendChild(NewContainer);

    var CM = CreateEditorFromTextArea(TA);
    Editors[NewID] = CM;

    var Saved = localStorage.getItem('Code_' + NewID);
    if (Saved) CM.setValue(Saved);

    CM.on('change', function() 
    {
        localStorage.setItem('Code_' + NewID, CM.getValue());
    });

    NewTab.addEventListener('click', function() 
    {
        document.querySelectorAll('.TabButton').forEach(B => B.classList.remove('Active'));
        NewTab.classList.add('Active');

        document.querySelectorAll('.EditorContainer').forEach(Container => Container.classList.remove('Active'));
        NewContainer.classList.add('Active');

        CurrentEditor = CM;
        CurrentEditor.refresh();
    });

    NewTab.click(); // Activate the new tab immediately
});