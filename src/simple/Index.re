/* let grid: Grid.grid = { squares: Utils.createList(100, e => ( {x: e mod 10, y: e < 10 ? 0 : (e - e mod 10) / 10, isSelected: false, imagePath: ""}: Square.square ))}; */
let grid: Grid.grid = { squares: Utils.createList(100, e => Square.createSquare(e mod 10,e < 10 ? 0 : (e - e mod 10) / 10, "") )};
let hero = Unit.createUnit(0,0, "units/bluearcherdown.png", 0, Hero);
let monster = Unit.createUnit(0,1, "units/redarcherdown.png", 1, Monster);
let units = [hero, monster];
let player = Player.createPlayer("Wesley", Red);

let gamestate = Gamestate.createGamestate(grid, units, player);

ReactDOMRe.renderToElementWithId(
  <GridComponent
    gamestate={gamestate}
  />,
  "grid",
);