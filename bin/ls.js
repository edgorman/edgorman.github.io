import { getPath, getFilePath } from "../sbin/utilities.js";

export function ls(terminal, relativePath){
    var files = []
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

                files.push(path[entry]);
            }

            console.log("INFO: (ls) Listed files in directory " + getFilePath(path) + ".");
            
            return [files, [], files]
        }
        else{
            return [[], ["Cannot list files from a non-directory path."], []]
        }
    }
    else{
        return [[], ["The system cannot find the path '" + relativePath + "'."], []]
    }
}