import { getPath, getFilePath } from "../sbin/utilities.js";

export function ls(terminal, relativePath){
    var path = getPath(terminal, relativePath);
    
    // If path exists
    if (path){
        // If path is directory
        if (path['_type'] == "dir"){
            // If path is not root
            if (path['_name'] != ""){
                terminal.echo($("<span class='directory-link' onclick='window.terminal.terminal.exec(\"cd .\");'>.</span>"));
                terminal.echo($("<span class='directory-link' onclick='window.terminal.terminal.exec(\"cd ..\");'>..</span>"));
            }

            // List all files in path
            for (var entry in path){
                if (String(entry).startsWith("_") || entry == "." || entry == ".."){
                    continue;
                }

                switch(path[entry]['_type']){
                    case 'dir':
                        terminal.echo($("<span class='directory-link' onclick='window.terminal.terminal.exec(\"cd " + entry + "\");'>" + entry + "</span>"));
                        break;
                    case 'sh':
                        terminal.echo($("<span class='executable-link' onclick='window.terminal.terminal.exec(\"cat " + entry + "\");'>" + entry + "</span>"));
                        break;
                    case 'js':
                        terminal.echo($("<span class='executable-link' onclick='window.terminal.terminal.exec(\"cat " + entry + "\");'>" + entry + "</span>"));
                        break;
                    default:
                        terminal.echo($("<span class='file-link' onclick='window.terminal.terminal.exec(\"cat " + entry + "\");'>" + entry + "</span>"));
                        break;
                }
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
}