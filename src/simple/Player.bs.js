'use strict';


function createPlayer(name, colour) {
  return {
          name: name,
          colour: colour
        };
}

exports.createPlayer = createPlayer;
/* No side effect */
