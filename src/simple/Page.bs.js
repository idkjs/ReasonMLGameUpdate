'use strict';

var React = require("react");

function handleClick(param) {
  console.log("clicked!");
  
}

function Page(Props) {
  var message = Props.message;
  return React.createElement("button", {
              onClick: (function (param) {
                  console.log("clicked!");
                  
                })
            }, message);
}

var make = Page;

exports.handleClick = handleClick;
exports.make = make;
/* react Not a pure module */
