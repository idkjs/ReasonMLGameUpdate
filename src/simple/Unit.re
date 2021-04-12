
type unitSubtype =
  | NPC
  | Hero
  | Monster

type unit = {
  x: int,
  y: int,
  imagePath: string,
  id: int,
  subtype: unitSubtype,
  coordinates: Coordinates.coordinates,
  equipment: Equipment.equipment,
  hp: int,
  baseAttack: int,
  baseSpeed: int,
  skills: list(Skill.skill),
  movementrange: int
};

let createEquipment = () => Equipment.creatEquipment(Equipment.createItem(EmptyLeftArm), Equipment.createItem(EmptyRightArm))

let compareUnitSpeed = (unit1: unit, unit2: unit) => {
    let speedComparison = compare(unit1.baseSpeed, unit2.baseSpeed)
    speedComparison == 0 ? compare(unit1.id, unit2.id) : speedComparison 
  }

let determineTurnOrder = (units: list(unit)) => List.sort(compareUnitSpeed, units)

let createUnit = (x, y, imagePath, id, subtype) => {x,y,imagePath, id, subtype, coordinates: Coordinates.createCoordinates(x,y), equipment: createEquipment(), hp: 10, baseAttack: 1, baseSpeed: 5, skills: [Skill.createFireball()], movementrange: 2 };

let getTotalAttack = (unit: unit) => unit.baseAttack + Equipment.getAttackModifierTotal(unit.equipment);

let isAlive = (unit: unit ) => unit.hp > 0

module type Locatable = {
  type t;
  let getXCoordinate: t => int;
  let getYCoordinate: t => int; 
};

module Make = (LocatableType: Locatable) => {
  type t = LocatableType.t;
  let compare = (locatable1: t, locatable2: t) => LocatableType.getXCoordinate(locatable1) === LocatableType.getXCoordinate(locatable2) && LocatableType.getYCoordinate(locatable1) === LocatableType.getYCoordinate(locatable2); 
};

module MakeGeneric = (LocatableType: Locatable, LocatableType2: Locatable) => {
  type t = LocatableType.t;
  type s = LocatableType2.t;
  let compare = (locatable1: t, locatable2: s) => LocatableType.getXCoordinate(locatable1) === LocatableType2.getXCoordinate(locatable2) && LocatableType.getYCoordinate(locatable1) === LocatableType2.getYCoordinate(locatable2); 
};

module Unit = {
  type t = unit;
  let getXCoordinate = unit => unit.x; 
  let getYCoordinate = unit => unit.y;
};

module LocatableUnit = Make(Unit);

