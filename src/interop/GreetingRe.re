/* ReasonReact used by ReactJS */
/* This is just a normal stateless component. The only change you need to turn
   it into a ReactJS-compatible component is the wrapReasonForJs call below */

[@react.component]
let make = (~message, ~extraGreeting=?) => {
  let greeting =
    switch (extraGreeting) {
    | None => "How are you?"
    | Some(g) => g
    };
  <div> <MyBannerRe show=true message={message ++ " " ++ greeting} /> </div>;
};
