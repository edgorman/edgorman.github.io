export function exit(terminal){
    var message = [];

    message.push("");
    message.push("Logging out of " + terminal.user.name + " ...");
    message.push("");
    message.push("Press Ctrl+W to close terminal.")
    message.push("Press Ctrl+R to restart terminal.")

    terminal.terminal.set_prompt("");
	terminal.terminal.freeze(true);

    console.log("INFO: (exit) Exited the terminal.");

    return message
}