import { loadFile, getPath } from "../sbin/utilities.js";

export function cat(terminal, relativePath){
    // If path is empty
    if (relativePath == undefined){
        relativePath = ".";
    }

    var path = getPath(terminal.fileSystem, terminal.currentDirectory, relativePath);
    // If path exists
    if (path){
        // If path is not a directory
        if (path['_type'] != "dir"){
            
            // Load file
            var file = loadFile(path['_parent'] + path['_name']);
            
            // If file is a picture
            if (['jpg', 'png'].includes(path['_type'])){
                terminal.echo($("<img src='" + path['_parent'] + path['_name'] + "' style='width: 50%; max-width: 320px;'/>"));
            }
            // Else is text file
            else{
                terminal.echo(file);
            }

            console.log("INFO: (cat) Displayed file " + path["_parent"] + path["_name"] + ".");
        }
        else{
            terminal.echo("[[;red;]Can only display text or pictures.]");
        }
    }
    else{
        terminal.echo("[[;red;]The system cannot find the path '" + relativePath + "'.]");
    }

    terminal.echo("");
}