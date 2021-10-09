export function promptMessage(username, hostname, directory){
    return username + "@" + hostname + " " + directory + "\n$ "
}

export function greetingMessage(username, hostname, commitMessage){
    return `Copyright (c) 2021 Edward Gorman` 
    + `\n<https://github.com/edgorman>`
    + `\n\nWelcome to https://`
    + hostname
    + `\nLast commit `
    + commitMessage
    + `\n\nYou are currently logged in as: [[b;;]` 
    + username
    + `]\nTo start, enter the command "[[b;;]help]"\n`
}

export function generateKeyMappings(){
    return { 
        'CTRL+R': function() { location.reload(); }
    }
}

function path_exists(path, from_dir, file_flag){
    if (path == undefined){
        return false;
    }

    let segments = String(path).split(/[\\/]/);
    let temp_directory = from_dir;

    // for each segment
    for (let i=0; i < segments.length; i++){
        var seg = segments[i];

        // self
        if (seg == "" || seg == "."){
            continue;
        }
        // parent dir
        else if (seg == '..'){
            if (temp_directory["_parent"] != ""){
                temp_directory = path_exists(temp_directory["_parent"], file_system, file_flag);
            }
        }
        // child
        else if (temp_directory[seg] != null){
            if (temp_directory[seg]["_type"] == "dir" || file_flag){
                temp_directory = temp_directory[seg];
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }
    return temp_directory;
}