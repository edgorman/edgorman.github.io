import { getPath, getFilePath } from "../sbin/utilities.js";

export function ls(terminal, relativePath){
    var path = getPath(terminal, relativePath);
    
    // If path exists
    if (path){
        // If path is directory
        if (path['_type'] == "dir"){
            // If path is not root
            if (path['_name'] != ""){
                terminal.echo("[[;#5b88df;].]");
                terminal.echo("[[;#5b88df;]..]");
            }

            // List all files in path
            for (var entry in path){
                if (String(entry).startsWith("_") || entry == "." || entry == ".."){
                    continue;
                }

                switch(path[entry]['_type']){
                    case 'dir':
                        terminal.echo("[[;#5b88df;]" + entry + "]");
                        break;
                    case 'sh':
                        terminal.echo("[[;#7bd833;]" + entry + "]");
                        break;
                    case 'js':
                        terminal.echo("[[;#7bd833;]" + entry + "]");
                        break;
                    default:
                        terminal.echo(entry);
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

    terminal.echo("");

}