type state = {
  isSelected: bool,
  isHovered: bool,
  isTargeted: bool,
};

type action =
  | Click(Square.square)
  | HoverOn
  | HoverOff;

let getClasses = (square: Square.square) =>
  "grid__square"
  ++ (square.isSelected ? " grid__square--selected" : "")
  ++ (
    !square.isSelected && square.isHovered && !square.isTargeted
      ? " grid__square--hovered" : ""
  )
  ++ (
    !square.isSelected && square.isTargeted ? " grid__square--targeted" : ""
  )
  ++ (square.inMovementRange ? " grid__square--in-movement-range" : "");

[@react.component]
let make =
    (~square: Square.square, ~handleClick, ~gamestate: Gamestate.gamestate) => {
  let (_, dispatch) =
    React.useReducer(
      (state, action) =>
        switch (action) {
        | HoverOn => {...state, isHovered: true}
        | HoverOff => {...state, isHovered: false}
        | _ => state
        },
      {isSelected: square.isSelected, isHovered: false, isTargeted: false},
    );
  let unitImage =
    switch (Gamestate.findUnit(gamestate.units, square.coordinates)) {
    | None => ""
    | Some(unit) =>
      Unit.isAlive(unit)
        ? "http://127.0.0.1:5500/src/images/" ++ unit.imagePath : ""
    };
  <svg
    onClick={_event => handleClick(GlobalActions.ClickedSquare(square))}
    onMouseOver={_event => handleClick(GlobalActions.HoverSquare(square))}
    onMouseLeave={_event => dispatch(HoverOff)}
    className={getClasses(square)}>
    <image
      width="60"
      height="60"
      href="http://127.0.0.1:5500/src/images/terrain/mountain.png"
      alt="lalala"
    />
    <image width="60" height="60" href=unitImage alt="lalala" />
  </svg>;
};
