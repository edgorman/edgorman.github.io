import { getPath, } from "../sbin/utilities.js";

export function ls(terminal, relativePath){
    // If path is empty
    if (relativePath == undefined){
        relativePath = ".";
    }

    var path = getPath(terminal.fileSystem, terminal.currentDirectory, relativePath);
    
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

            console.log("INFO: (ls) Listed files in directory " + terminal.currentDirectory["_parent"] + terminal.currentDirectory["_name"] + ".");
            terminal.echo("");
        }
        else{
            terminal.echo("[[;red;]Cannot list files from a non-directory path.]\n");
        }
    }
    else{
        terminal.echo("[[;red;]The system cannot find the path '" + relativePath + "'.]\n");
    }

}