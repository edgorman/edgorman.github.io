export function help(terminal){
    terminal.echo("These comands are replicas of commands found in linux-based systems.");
    terminal.echo("This terminal emulates their functionality using client-side javascript.");

    terminal.echo("");

    terminal.echo("cat\t\t\t\tPrint file contents");
    terminal.echo("cd\t\t\t\tChange current directory");
    terminal.echo("clear\t\t\tClear terminal of input");
    terminal.echo("date\t\t\tDisplay the current date");
    terminal.echo("debug\t\t\tDisplay the most recent commit");
    terminal.echo("echo\t\t\tPrint the message passed");
    terminal.echo("help\t\t\tShow the available commands");
    terminal.echo("history\t\t\tList the most recent commands");
    terminal.echo("ls\t\t\t\tList the files in current directory");
    terminal.echo("pwd\t\t\t\tPrint the working directory");
    terminal.echo("touch\t\t\tCreate file at directory passed");
    terminal.echo("uname\t\t\tDisplay the system's OS");
    terminal.echo("whoami\t\t\tDisplay the system's hostname");

    console.log("INFO: (help) Displayed help message.");

    terminal.echo("");
}