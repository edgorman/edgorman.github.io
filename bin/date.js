export function date(terminal){
    var date = Date();
    terminal.echo([date]);
    
    console.log("INFO: (date) Displayed date message.");

    return date;
}