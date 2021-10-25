import { loadFile, getPath, getFilePath } from "../sbin/utilities.js";

export function cat(terminal, relativePath){
    var path = getPath(terminal, relativePath);

    // If path exists
    if (path){
        // If path is not a directory
        if (path['_type'] != "dir"){
            
            // Load file
            var file = loadFile(getFilePath(path));
            
            // If file is a picture
            if (['jpg', 'png'].includes(path['_type'])){
                terminal.echo($("<img src='" + getFilePath(path) + "' style='width: 50%; max-width: 320px;'/>"));
            }
            // Else is text file
            else{
                terminal.echo(file);
            }

            console.log("INFO: (cat) Displayed file " + getFilePath(path) + ".");
        }
        else{
            terminal.echo("[[;red;]Can only display text or pictures.]");
        }
    }
    else{
        terminal.echo("[[;red;]The system cannot find the path '" + relativePath + "'.]");
    }
}