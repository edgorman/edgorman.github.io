import { getPath, getFilePath, generatePromptMessage} from "../sbin/utilities.js";

export function cd(terminal, relativePath){
    var path = getPath(terminal, relativePath);

    // If path exists
    if (path){
        // If path is directory
        if (path['_type'] == "dir"){
            // Change directory to path
            terminal.currentDirectory = path;

            var prompt = generatePromptMessage(terminal, getFilePath(path))
            terminal.terminal.set_prompt(prompt);
    
            console.log("INFO: (cd) Changed directory to " + getFilePath(path) + ".");
        }
        else{
            terminal.echo("[[;red;]Cannot change to non-directory path.]");
        }
    }
    else{
        terminal.echo("[[;red;]The system cannot find the path '" + relativePath + "'.]");
    }
}