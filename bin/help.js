export function help(terminal){
    var message = [];

    message.push("These comands are replicas of commands found in linux-based systems.");
    message.push("This terminal emulates their functionality using client-side javascript.");

    message.push("");

    message.push("cat\t\t\t\tPrint file contents");
    message.push("cd\t\t\t\tChange current directory");
    message.push("clear\t\t\tClear terminal of input");
    message.push("date\t\t\tDisplay the current date");
    message.push("debug\t\t\tDisplay the most recent commit");
    message.push("echo\t\t\tPrint the message passed");
    message.push("help\t\t\tShow the available commands");
    message.push("history\t\t\tList the most recent commands");
    message.push("ls\t\t\t\tList the files in current directory");
    message.push("pwd\t\t\t\tPrint the working directory");
    message.push("touch\t\t\tCreate file at directory passed");
    message.push("uname\t\t\tDisplay the system's OS");
    message.push("whoami\t\t\tDisplay the system's hostname");

    message.push("");

    console.log("INFO: (help) Displayed help message.");

    return message;
}