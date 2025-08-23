Game.Require("Script_2")

for (let I = 0; I < 9; I++)
{
	QuickCreateCircle(true, 100 * I, Game.Height - 100, 50, Math.randomHexColour())
}

for (let I = 0; I < 8; I++)
{
	QuickCreateCircle(true, 50 + 100 * I, Game.Height - 200, 50, Math.randomHexColour())
}

for (let I = 0; I < 7; I++)
{
	QuickCreateCircle(true, 100 + 100 * I, Game.Height - 300, 50, Math.randomHexColour())
}

let Floor = QuickCreateRect(true, Game.Width / 2, Game.Height, Game.Width, 100, "green")
Matter.Body.setStatic(Floor.Body, true)

Game.Update = function()
{
	Game.Clear()
	UpdateECS()
}