import { getPath, generatePromptMessage} from "../sbin/utilities.js";

export function cd(terminal, relativePath){
    var currentDirectory = terminal.currentDirectory;

    // If path is empty
    if (relativePath == undefined){
        relativePath = ".";
    }
        
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

    // If path starts with root
    if (String(relativePath).startsWith("/")){
        currentDirectory = terminal.fileSystem["/"];
        relativePath = String(relativePath).substring(1, relativePath.length);
    }

    var path = getPath(terminal.fileSystem, currentDirectory, relativePath);

    // If path exists
    if (path){
        // If path is directory
        if (path['_type'] == "dir"){
            // Change directory to path
            terminal.currentDirectory = path;

            var prompt = generatePromptMessage(terminal, path["_parent"] + path["_name"])
            terminal.terminal.set_prompt(prompt);
    
            console.log("INFO: (cd) Changed directory to " + path["_parent"] + path["_name"] + ".");
        }
        else{
            terminal.echo("[[;red;]Cannot change to non-directory path.]");
        }
    }
    else{
        terminal.echo("[[;red;]The system cannot find the path '" + relativePath + "'.]");
    }

    terminal.echo("");
}