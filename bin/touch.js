import { splitPath, getFilePath, getParentPath } from "../sbin/utilities.js";

export function touch(terminal, relativePath){
    var path = getParentPath(terminal, relativePath);

    // If path exists
    if (path){
        // If path is directory
        if (path['_type'] == "dir"){
            // Generate the filename
            var pathSegments = splitPath(relativePath);
            var filename = pathSegments[pathSegments.length - 1];
            filename = filename.replace("~", "");

            // If filename is not defined
            if (filename != undefined){

                console.log("INFO: (touch) Created file " + filename + " at " + getFilePath(path) + ".");
            }
            else{
                terminal.echo("[[;red;]Cannot create file without a name.]");
            }
        }
        else{
            terminal.echo("[[;red;]Cannot create file in non-directory path.]");
        }
    }
    else{
        terminal.echo("[[;red;]The system cannot find the parent directory of '" + relativePath + "'.]");
    }

    terminal.echo("");
}