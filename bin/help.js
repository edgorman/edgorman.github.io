export function help(terminal){
    terminal.echo("These comands are replicas of commands found in linux-based systems.");
    terminal.echo("This terminal emulates their functionality using client-side javascript.");

    terminal.echo("");

    terminal.echo("cat\t\t\t\tPrint file contents");
    terminal.echo("cd\t\t\t\tChange current directory");
    terminal.echo("clear\t\t\tClear terminal of content");
    terminal.echo("date\t\t\tPrint the current date");
    terminal.echo("debug\t\t\tPrint the most recent commit");
    terminal.echo("echo\t\t\tPrint the message passed");
    terminal.echo("help\t\t\tPrint this help message");
    terminal.echo("history\t\t\tPrint the last commands");
    terminal.echo("ls\t\t\t\tPrint the files in current directory");
    terminal.echo("pwd\t\t\t\tPrint the working directory");
    terminal.echo("touch\t\t\t\tCreate a file at directory passed");
    terminal.echo("uname\t\t\tPrint the system OS");
    terminal.echo("whoami\t\t\tPrint the system hostname");

    console.log("INFO: (help) Displayed help message.");

    terminal.echo("");
}