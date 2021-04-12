let map = (fn: ('a) => 'b, option: option('a)): option('b) => 
    switch (option) {
    | None => None
    | Some(content) => Some(fn(content))
    };

let optionStringtoString = (option: option(string)): string => {
    switch(option) {
    | None => "leeg"
    | Some(content) => content 
    }
}

let optionIntToString = (option: option(int)) : string => map(string_of_int, option) |> optionStringtoString;

let contains = (option: option('a), value: 'a) => {
    switch(option) {
        | None => false
        | Some(content) => content == value
    }
}