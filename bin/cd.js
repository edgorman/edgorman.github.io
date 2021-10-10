import { getPath, generatePromptMessage} from "../sbin/utilities.js";

export function cd(terminal, relativePath){
    // If path equals home directory
    if (relativePath == "~"){
        terminal.currentDirectory = terminal.fileSystem["/"];
        relativePath = terminal.user.homeDirectory;
    }

    // If path equals root
    if (relativePath == "/" || relativePath == "\\"){
        terminal.currentDirectory = terminal.fileSystem["/"];
        relativePath = "";
    }

    // Check path exists
    var path = getPath(terminal.fileSystem, terminal.currentDirectory, relativePath);
    if (path){
        terminal.currentDirectory = path;

        var prompt = generatePromptMessage(terminal.user.name, terminal.hostname, path["_parent"] + path["_name"])
        terminal.terminal.set_prompt(prompt);

        terminal.echo("");
    }
    else{
        terminal.echo("[[;red;]The system cannot find the path '" + relativePath + "'.]\n");
    }

    console.log("INFO: (cd) Changed directory to " + terminal.currentDirectory["_parent"] + terminal.currentDirectory["_name"] + ".");
}