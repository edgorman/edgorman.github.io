export function pwd(terminal){
    terminal.echo(terminal.currentDirectory['_parent'] + terminal.currentDirectory['_name']);

    console.log("INFO: (pwd) Displayed the working directory.");

    terminal.echo("");
}