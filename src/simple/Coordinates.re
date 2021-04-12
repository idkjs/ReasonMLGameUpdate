type coordinates = {
    x: int,
    y: int
};

let createCoordinates = (x, y) => {x,y};

let equals = (coordinates1, coordinates2) => coordinates1.x === coordinates2.x && coordinates1.y === coordinates2.y;

let sum = (coordinates1, coordinates2) => createCoordinates(coordinates1.x + coordinates2.x, coordinates1.y + coordinates2.y);

let distance = (coordinates1, coordinates2) => Js.Math.abs_int(coordinates1.x - coordinates2.x) + Js.Math.abs_int(coordinates1.y - coordinates2.y);

let distance2 = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => Js.Math.abs_int(x1 - x2) + Js.Math.abs_int(y1 - y2);