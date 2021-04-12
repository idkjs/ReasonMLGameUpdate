/* ReactJS used by ReasonReact */
/* This component wraps a ReactJS one, so that ReasonReact components can consume it */
/* Typing the myBanner.js component's output as a `reactClass`. */
[@bs.module] [@react.component]external make: (~show:bool, ~message:string, ~children:React.element=?) =>React.element= "./MyBanner";


