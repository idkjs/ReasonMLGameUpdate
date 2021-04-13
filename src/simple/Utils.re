let createSquare = (handleClick, gamestate: Gamestate.gamestate, square : Square.square ) => <SquareComponent square=square handleClick=handleClick gamestate=gamestate />;

let rec range = n => n == 0 ? [] : [n - 1, ...range(n - 1)]

let createList = (y, create) => range(y) |> List.map(create);

let updateList = (condition: ('a) => bool, updateItem: ('a) => 'a) => List.map(item => condition(item) ? updateItem(item) : item);

let createReasonReactArray = (y, create) => createList(y, create) |> Array.of_list |> React.array;

let createGrid = (x, y, create, squares: list(Square.square)) =>
  createReasonReactArray(x, i =>
    createReasonReactArray(y, j =>
      create(
        List.find((square: Square.square) => square.x === i && square.y === j, squares)
      )
    )
  );

let rec filledRange = (n, create) =>
  switch (n) {
  | 0 => []
  | n => [create(n - 1), ...filledRange(n - 1, create)]
  } /* ook (n) => (create) => .... */;

/* let get3 = filledRange(3) /*(create) => filledRange(10, create) )*/;

let get10Squares = get3(_n => "square") /*["square","square","square"]*/;
 */
