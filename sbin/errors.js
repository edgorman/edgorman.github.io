export function onCommandNotFound(t, command){
    t.echo("[[;red;]Error: Command not found '" + command + "']\n");
}

export function exceptionThrown(t, exception){
    alert(exception);
}