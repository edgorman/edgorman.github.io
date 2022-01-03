import { getPath, getFilePath } from "../lib/utilities.js";

export function ls(terminal, args){
    // Default arguments
    var options = {'_': ".", 's': false, 'a': false, 'd': false, 'D': false};

    // Check if any arguments passed
    if (args.length > 0)
    {
        // Parse arguments
        var pOptions = $.terminal.parse_options(args, { boolean: ['a', 'd', 'D']});

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
    var entryFilter = options["s"];
    var path = getPath(terminal, relativePath);

    // If path exists
    if (path){
        // If path is directory
        if (path['_type'] == "dir"){
            // Create a sorted version of path
            var sPath = []
            for (var entry in path){
                if (entry.startsWith("_"))
                    continue;
                sPath.push(path[entry]);
            }

            // Sort by alphabetical (default)
            // Sort by date ascending
            if (options["d"]){
                sPath.sort(function(a, b) {
                    return new Date(a["_date"]) - new Date(b["_date"]);
                });
            }
            // Sort By date descending
            else if (options["D"]){
                sPath.sort(function(a, b) {
                    return new Date(b["_date"]) - new Date(a["_date"]);
                });
            }

            // Add . and .. entries if not root
            if (path["_parent"] != ""){
                files.push({"_name": ".", "_date": path["_date"], "_time": path["_time"], "_type": "dir", "_parent": path["_parent"]});
                files.push({"_name": "..", "_date": path["_date"], "_time": path["_time"], "_type": "dir", "_parent": path["_parent"]});
            }

            // List all files in path
            for (var entry in sPath){
                var value = sPath[entry];

                // Filter entries by string
                if (typeof(entryFilter) == "string"){
                    if (value['_name'].toLowerCase().includes(entryFilter.toLowerCase())){
                        files.push(value);
                    }
                }
                // Else just add all entries
                else{
                    files.push(value);
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