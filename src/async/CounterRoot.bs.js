'use strict';

var React = require("react");
var Counter = require("./Counter.bs.js");
var ReactDOMRe = require("reason-react/src/legacy/ReactDOMRe.bs.js");

ReactDOMRe.renderToElementWithId(React.createElement(Counter.make, {}), "index");

/*  Not a pure module */
