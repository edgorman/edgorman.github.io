export function history(terminal){
    var history = terminal.terminal.history().data();

    for (var i = 0; i < 25; i++){
        terminal.echo((i + 1) + "\t" + history[history.length - i - 1]);
    }

    console.log("INFO: (history) Displayed history message.");

    terminal.echo("");
}