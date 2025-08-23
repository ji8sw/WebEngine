let Scene = {}
Scene.Entities = []

function AddTransform(Entity)
{ // only the W is used for circle radius
	let NewComponent = {}
	NewComponent.X = 0
	NewComponent.Y = 0
	NewComponent.W = 0
	NewComponent.H = 0
	NewComponent.R = 0
	Entity.Transform = NewComponent
}

function AddRectRenderer(Entity)
{
	if (Entity.Transform === undefined) AddTransform(Entity)
	
	let NewComponent = {}
	const T = Entity.Transform
	NewComponent.Colour = "white"
	NewComponent.Update = function()
	{
		Game.DrawRect(T.X, T.Y, T.W, T.H, NewComponent.Colour, T.R)
	}
	Entity.Renderer = NewComponent
}

function AddCircleRenderer(Entity)
{
	if (Entity.Transform === undefined) AddTransform(Entity)
	
	let NewComponent = {}
	const T = Entity.Transform
	NewComponent.Colour = "white"
	NewComponent.Update = function()
	{
		Game.DrawCircle(T.X, T.Y, T.W, NewComponent.Colour, T.R)
	}
	Entity.Renderer = NewComponent
}

function AddRectBody(Entity)
{
	if (Entity.Transform === undefined) AddTransform(Entity)
	
	const T = Entity.Transform
	let Body = Matter.Bodies.rectangle(T.X, T.Y, T.W, T.H)
	Body.angle = T.R * Math.PI / 180
	
	Matter.World.add(Game.PhysWorld, Body)
	Entity.Body = Body	
}

function AddCircleBody(Entity)
{
	if (Entity.Transform === undefined) AddTransform(Entity)
	
	const T = Entity.Transform
	let Body = Matter.Bodies.circle(T.X, T.Y, T.W)
	Body.angle = T.R * Math.PI / 180
	
	Matter.World.add(Game.PhysWorld, Body)
	Entity.Body = Body	
}

Game.Update = function()
{
	Game.Clear()
	
	for (const EntID in Scene.Entities)
	{
		if (Scene.Entities[EntID].Update != undefined)
			Scene.Entities[EntID].Update()
		
		if (Scene.Entities[EntID].Renderer != undefined)
			Scene.Entities[EntID].Renderer.Update()
		
		if (Scene.Entities[EntID].Body != undefined && Scene.Entities[EntID].Transform != undefined)
		{
			let T = Scene.Entities[EntID].Transform
			let B = Scene.Entities[EntID].Body
			
			T.X = B.position.x
			T.Y = B.position.y
			T.R = B.angle
			Scene.Entities[EntID].Transform = T
		}
	}
}

function QuickCreateCircle(Physics = false, X = 0, Y = 0, Radius = 50, Colour = "white")
{
	let NewEnt = {}
	AddTransform(NewEnt)
	AddCircleRenderer(NewEnt)
	NewEnt.Renderer.Colour = Colour
	NewEnt.Transform.X = X
	NewEnt.Transform.Y = Y
	NewEnt.Transform.W = Radius
	if (Physics) AddCircleBody(NewEnt)
	Scene.Entities.push(NewEnt)
	return NewEnt
}

function QuickCreateRect(Physics = false, X = 0, Y = 0, W = 100, H = 100, Colour = "white")
{
	let NewEnt = {}
	AddTransform(NewEnt)
	AddRectRenderer(NewEnt)
	NewEnt.Renderer.Colour = Colour
	NewEnt.Transform.X = X
	NewEnt.Transform.Y = Y
	NewEnt.Transform.W = W
	NewEnt.Transform.H = H
	if (Physics) AddRectBody(NewEnt)
	Scene.Entities.push(NewEnt)
	return NewEnt
}