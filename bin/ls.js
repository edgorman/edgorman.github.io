import { getPath, } from "../sbin/utilities.js";

export function ls(terminal, relativePath){
    var currentDirectory = terminal.currentDirectory;

    // If path is empty
    if (relativePath == undefined){
        relativePath = ".";
    }

    // If path equals home directory
    if (relativePath == "~"){
        currentDirectory =  terminal.fileSystem["/"];
        relativePath = terminal.user.homeDirectory;
    }

    // If path equals root
    if (relativePath == "/" || relativePath == "\\"){
        currentDirectory = terminal.fileSystem["/"];
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
            // List all files in path
            for (var entry in path){
                if (String(entry).startsWith("_")){
                    continue;
                }

                terminal.echo(entry);
            }

            console.log("INFO: (ls) Listed files in directory " + path["_parent"] + path["_name"] + ".");
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