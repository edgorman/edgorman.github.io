export function uname(terminal){
    var name = terminal.terminal.name();
    terminal.echo([name]);

    console.log("INFO: (uname) Displayed uname message.");

    return name
}