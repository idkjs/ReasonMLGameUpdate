type areaOfEffect =
     | SingleTarget
     | AreaOfEffect(list(Coordinates.coordinates))
     | NoTarget 

type skilltype = 
    | Fireball

type skill = {
    name: string,
    skilltype: skilltype,
    cooldown: int,
    targetingReticule: areaOfEffect,
}

let createSkill = (name, skilltype, cooldown, targetingReticule) => {
    name: name,
    skilltype: skilltype,
    cooldown: cooldown,
    targetingReticule: targetingReticule,
}

let areaPlus = AreaOfEffect([
    Coordinates.createCoordinates(0,0), 
    Coordinates.createCoordinates(1,0), 
    Coordinates.createCoordinates(0,1), 
    Coordinates.createCoordinates(-1,0), 
    Coordinates.createCoordinates(0,-1)
])

let createFireball = () => createSkill("Fireball", Fireball, 0, areaPlus)