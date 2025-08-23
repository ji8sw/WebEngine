# Examples

The examples include a variety of scripts that demonstrate the capabilities of WebEngine.

Some of the scripts are standalone while others are libraries that can be used in your own projects.

## Examples
- [**WebEngine Example**](https://ji8sw.github.io/WebEngine/Examples/WebEngineExample.js):
  - Demonstrates simple usage of a variety of WebEngine features.
- [**EntityComponentSystem**](https://ji8sw.github.io/WebEngine/Examples/EntityComponentSystem.js):
  - A simple Entity Component System (ECS) implementation for easily creating entities and components such as renderers and physics bodies.
  - `void UpdateECS()` - you must call this function in your `Game.Update` function to update the ECS.
  - `void QuickCreateCircle(bool Physics = false, int X = 0, int Y = 0, int Radius = 50, string Colour = "white")`
  - `void QuickCreateRect(bool Physics = false, int X = 0, int Y = 0, int W = 50, int H = 50, string Colour = "white")`
- [**ECSUsage**](https://ji8sw.github.io/WebEngine/Examples/ECSUsage.js):
  - Example of how to use `EntityComponentSystem.js`
  - Requires `EntityComponentSystem.js` as `Script_2`