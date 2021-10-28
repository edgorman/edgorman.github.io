export function history(terminal){
    var message = [];
    var history = terminal.terminal.history().data();

    for (var i = 0; i < 25; i++){
        message.push((i + 1) + "\t" + history[history.length - i - 1]);
    }

    console.log("INFO: (history) Displayed history message.");

    return message;
}