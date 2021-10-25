export function exit(terminal){
    terminal.echo("");
    terminal.echo("Logging out of " + terminal.user.name + " ...");
    terminal.echo("");
    terminal.echo("Press Ctrl+W to close terminal.")
    terminal.echo("Press Ctrl+R to restart terminal.")

    terminal.terminal.set_prompt("");
	terminal.terminal.freeze(true);

    console.log("INFO: (exit) Exited the terminal.");
}