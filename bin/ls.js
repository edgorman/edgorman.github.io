import { getPath, getFilePath } from "../sbin/utilities.js";

export function ls(terminal, args){
    // Default arguments
    var options = {'_': ".", 'd': false, 'f': false};

    // Check if any arguments passed
    if (args.length > 0)
    {
        // Parse arguments
        var pOptions = $.terminal.parse_options(args, { boolean: ['d', 'f']});

        // Check arguments received are expected
        var pKeys = Object.keys(pOptions);
        for (let i = 0; i < pKeys.length; i++)
        {
            if (!Object.keys(options).includes(pKeys[i]))
            {
                return [[], ["Could not parse, unknown argument '" + pKeys[i] + "' in command."], []]
            }
        }

        options = pOptions;
    }

    // Handle ls options
    if (options.d == options.f){
        options.d = true;
        options.f = true;
    }
    else if(options.d){
        options.f = false;
    }
    else if(options.f){
        options.d = false;
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

                // If files should be shown or if directories should be shown
                if (options.d && path[entry]['_type'] == "dir" ||
                    options.f && path[entry]['_type'] != "dir"){
                    files.push(path[entry]);
                }
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