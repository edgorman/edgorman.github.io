export function echo(terminal, message){
    message = message.join(" ");
    message == "hello there" ? terminal.echo("general kenobi") : terminal.echo(message);

    console.log("INFO: (echo) Displayed echo message.");
}