import { getPath, getFilePath } from "../sbin/utilities.js";

export function ls(terminal, args){
    // Default arguments
    var options = {'_': "."};

    // Check if any arguments passed
    if (args.length > 0)
    {
        // Parse arguments
        var pOptions = $.terminal.parse_options(args, { boolean: []});

        // Check arguments received are expected
        var pKeys = Object.keys(pOptions);
        for (let i = 0; i < pKeys.length; i++)
        {
            if (!Object.keys(options).includes(pKeys[i]))
            {
                return [[], ["Could not parse, unknown argument '" + pKeys[i] + "' in command."], []]
            }
        }

        options = pOptions
    }

    // Get path
    var files = []
    var relativePath = options["_"][0];
    var path = getPath(terminal, relativePath);
    
    // If path exists
    if (path){
        // If path is directory
        if (path['_type'] == "dir"){
            // List all files in path
            for (var entry in path){
                // Ignore entrys that start with _
                if (String(entry).startsWith("_")){
                    continue;
                }

                files.push(path[entry]);
            }

            console.log("INFO: (ls) Listed files in directory " + getFilePath(path) + ".");
            
            return [files, [], getFilePath(path)]
        }
        else{
            return [[], ["Cannot list files from a non-directory path."], []]
        }
    }
    else{
        return [[], ["The system cannot find the path '" + relativePath + "'."], []]
    }
}