import { getPath, getFilePath } from "../sbin/utilities.js";

export function ls(terminal, relativePath){
    var path = getPath(terminal, relativePath);
    
    // If path exists
    if (path){
        // If path is directory
        if (path['_type'] == "dir"){
            // List all files in path
            for (var entry in path){
                if (String(entry).startsWith("_")){
                    continue;
                }

                terminal.echo(entry);
            }

            console.log("INFO: (ls) Listed files in directory " + getFilePath(path) + ".");
        }
        else{
            terminal.echo("[[;red;]Cannot list files from a non-directory path.]");
        }
    }
    else{
        terminal.echo("[[;red;]The system cannot find the path '" + relativePath + "'.]");
    }

    terminal.echo("");

}