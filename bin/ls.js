import { getPath, getFilePath } from "../sbin/utilities.js";

export function ls(terminal, relativePath){
    var message = []
    var path = getPath(terminal, relativePath);
    
    // If path exists
    if (path){
        // If path is directory
        if (path['_type'] == "dir"){
            // If path is not root
            if (path['_name'] != ""){
                message.push($("<span class='directory-link' onclick='window.terminal.terminal.exec(\"cd .\");'>.</span>"));
                message.push($("<span class='directory-link' onclick='window.terminal.terminal.exec(\"cd ..\");'>..</span>"));
            }

            // List all files in path
            for (var entry in path){
                if (String(entry).startsWith("_") || entry == "." || entry == ".."){
                    continue;
                }

                switch(path[entry]['_type']){
                    case 'dir':
                        message.push($("<span class='directory-link' onclick='window.terminal.terminal.exec(\"cd " + entry + "\");'>" + entry + "</span>"));
                        break;
                    case 'sh':
                        message.push($("<span class='executable-link' onclick='window.terminal.terminal.exec(\"cat " + entry + "\");'>" + entry + "</span>"));
                        break;
                    case 'js':
                        message.push($("<span class='executable-link' onclick='window.terminal.terminal.exec(\"cat " + entry + "\");'>" + entry + "</span>"));
                        break;
                    default:
                        message.push($("<span class='file-link' onclick='window.terminal.terminal.exec(\"cat " + entry + "\");'>" + entry + "</span>"));
                        break;
                }
            }

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