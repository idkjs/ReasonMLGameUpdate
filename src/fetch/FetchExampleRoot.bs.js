'use strict';

var React = require("react");
var ReactDOMRe = require("reason-react/src/legacy/ReactDOMRe.bs.js");
var FetchExample = require("./FetchExample.bs.js");

ReactDOMRe.renderToElementWithId(React.createElement(FetchExample.make, {}), "index");

/*  Not a pure module */
