export function echo(terminal, message){
    message = message.join(" ");
    var result = message == "hello there" ? "general kenobi" : message;

    console.log("INFO: (echo) Displayed echo message.");

    return [result];
}