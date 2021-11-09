export function uname(terminal){
    var name = terminal.terminal.name();

    console.log("INFO: (uname) Displayed uname message.");

    return [[name], [], []];
}