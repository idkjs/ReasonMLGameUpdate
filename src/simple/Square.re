type square = {
  x: int,
  y: int,
  imagePath: string,
  isSelected: bool,
  isTargeted: bool,
  isHovered: bool,
  inMovementRange: bool,
  coordinates: Coordinates.coordinates,
};

let createSquare= (x, y, imagePath) => {x,y,imagePath, isSelected: false, isTargeted: false, isHovered: false, coordinates: Coordinates.createCoordinates(x,y), inMovementRange: false };

let getSquares = (relativeCoordinates: list(Coordinates.coordinates), squares: list(square), centerCoordinates: Coordinates.coordinates) => 
          List.filter(square => List.exists(relativeCoordinate => Coordinates.equals(square.coordinates, Coordinates.sum(relativeCoordinate, centerCoordinates)), relativeCoordinates), squares)

let reset = (square) => {...square, isSelected: false, isTargeted: false, isHovered: false, inMovementRange: false }

/* module Square = {
  type t = square;
  let getXCoordinate = square => square.x; 
  let getYCoordinate = square => square.y;
}; */

/* 
let distance = ({x,y}) => x + y;

let lol = distance(createSquare(1,1,""));

module LocatableSquare = Unit.Make(Square);

module LocatableUnitSquare = Unit.MakeGeneric(Unit.Unit, Square); */