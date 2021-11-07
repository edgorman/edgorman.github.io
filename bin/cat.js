import { loadFile, getPath, getFilePath } from "../sbin/utilities.js";

export function cat(terminal, relativePath){
    var path = getPath(terminal, relativePath);

    // If path exists
    if (path){
        // If path is not a directory
        if (path['_type'] != "dir"){
            // Load file
            var file = loadFile(getFilePath(path));

            console.log("INFO: (cat) Displayed file " + getFilePath(path) + ".");
            
            // If file is a picture
            if (['jpg', 'png'].includes(path['_type'])){
                file = $("<img src='" + getFilePath(path) + "' style='width: 50%; max-width: 320px;'/>");
            }
            
            terminal.echo([file]);
            return file;
        }
        else{
            terminal.error("Can only display text or pictures.");
        }
    }
    else{
        terminal.error("The system cannot find the path '" + relativePath + "'.");
    }

    return "";
}