import { getPath, getFilePath } from "../sbin/utilities.js";

export function ls(terminal, relativePath){
    var message = []
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

                message.push(path[entry]);
            }

            terminal.echoFiles(message);

            console.log("INFO: (ls) Listed files in directory " + getFilePath(path) + ".");

            return message;
        }
        else{
            terminal.error("Cannot list files from a non-directory path.");
        }
    }
    else{
        terminal.error("The system cannot find the path '" + relativePath + "'.");
    }

    return [];
}