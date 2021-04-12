type gamestate = {
  grid: Grid.grid,
  units: list(Unit.unit),
  selectedUnitId : option(int),
  interactionMode: InteractionMode.interactions,
  player: Player.player
};

let createGamestate = (grid, units, player) => {
  {grid, units, selectedUnitId: None, interactionMode: SelectingAction, player };
};

let findUnit = (units: list(Unit.unit), coordinates: Coordinates.coordinates): option(Unit.unit) => 
List.exists((unit: Unit.unit) => Coordinates.equals(unit.coordinates, coordinates), units) 
      ? Some(List.find((unit: Unit.unit) => Coordinates.equals(unit.coordinates, coordinates), units))
      : None;

let valueOrDefault = (option: option('a), default: 'a) => switch(option){
  | None => default
  | Some(value) => value 
}

let updateGamestate = (~squares=?, ~interactionMode=?, ~selectedUnitId=?, ~units=?, gamestate) => 
{
  ...gamestate,
  units: valueOrDefault(units, gamestate.units),
  grid: {
    squares: valueOrDefault(squares, gamestate.grid.squares)
  },
  selectedUnitId: valueOrDefault(selectedUnitId, gamestate.selectedUnitId),
  interactionMode: valueOrDefault(interactionMode, gamestate.interactionMode),
}