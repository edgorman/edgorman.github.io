export function whoami(terminal){
    terminal.echo(terminal.hostname);

    console.log("INFO: (whoami) Displayed who am I message.");

    terminal.echo("");
}