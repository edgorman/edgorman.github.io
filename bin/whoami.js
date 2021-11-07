export function whoami(terminal){
    var name = terminal.hostname;
    terminal.echo([name]);
    
    console.log("INFO: (whoami) Displayed who am I message.");

    return name;
}