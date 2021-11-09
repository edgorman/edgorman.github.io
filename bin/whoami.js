export function whoami(terminal){
    var name = terminal.hostname;
    
    console.log("INFO: (whoami) Displayed who am I message.");

    return [[name], [], []];
}