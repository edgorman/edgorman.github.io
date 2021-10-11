/* 
utilities.js 

@edgorman 09-10-21
*/

export function onCommandNotFound(terminal, command){
    terminal.echo("[[;red;]Error: Command not found '" + command + "']\n");
}

export function onExceptionThrown(terminal, exception){
    console.error("ERROR: " + exception);
    terminal.echo("[[;red;]Error: " + exception + "]\n");
}

export function generatePromptMessage(username, hostname, directory){
    document.title = directory;
    return username + "@" + hostname + " " + directory + "\n$ "
}

export function generateGreetingMessage(username, hostname, commitMessage){
    return "";
//  return `Copyright (c) 2021 Edward Gorman` 
//  + `\n<https://github.com/edgorman>`
//  + `\n\nWelcome to https://`
//  + hostname
//  + `\n`
//  + commitMessage
//  + `\n\nYou are currently logged in as: [[b;;]` 
//  + username
//  + `]\nTo start, enter the command "[[b;;]help]"`;
}

export function generateCommitMessage(commit){
    return "Last commit by " 
    + commit['author']
    + " on "
    + commit['date']
    + " ("
    + commit['id']
    + ")";
}

export function generateKeyMappings(){
    return { 
        'CTRL+R': function() { location.reload(); }
    }
}

function loadFile(path, successMsg, ErrorMsg){
    var result;

    $.ajax({
        url: path,
        cache: false,
        async: false,
        success:function(data) {
            result = data;
            console.info("INFO: " + successMsg);
        }
        }).fail(function() {
            console.error("ERROR: " + ErrorMsg);
            window.stop();
        }
    );
    
    return result;
}

export function loadFileSystem(fileSystemPath){
    return loadFile(
        fileSystemPath, 
        "Successfully loaded file system from json file.",
        "Failed to retrieve file system from json file."
    );
}

export function loadGitHistory(gitHistoryPath){
    return loadFile(
        gitHistoryPath,
        "Successfully loaded git history from json file.",
        "Failed to retrieve git history from json file."
    );
}

function splitPath(path){
    if (String(path).startsWith("/"))
        path = path.substring(1, path.length);
    
    if (String(path).endsWith("/"))
        path = path.substring(0, path.length - 1);

    if (path == "") return [];
    else return String(path).split(/[\\/]/);
}

export function getAbsolutePath(fileSystem, absolutePath){
    // Assumes the absolute path must exist
    var path = fileSystem["/"];

    var pathSegments = splitPath(absolutePath);
    for (var i = 0; i < pathSegments.length; i++){
        path = path[pathSegments[i]];
    }

    return path;
}

export function getPath(fileSystem, currentDirectory, relativePath){
    // Navigate to current directory
    var path = getAbsolutePath(fileSystem, currentDirectory["_parent"] + currentDirectory["_name"]);

    // Navigate to relative path
    var pathSegments = splitPath(relativePath);
    for (var i = 0; i < pathSegments.length; i++){

        if (pathSegments[i] == "" || pathSegments[i] == "."){
            continue;
        }
        else if (pathSegments[i] == ".."){
            path = getAbsolutePath(fileSystem, path['_parent']);
        }
        else{
            if (pathSegments[i] in path){
                path = path[pathSegments[i]];
            }
            else{
                // Path does not exist
                return false;
            }
        }

    }

    // Path must exist
    return path;
}

export function onCompletion(terminal){
    var input = $.terminal.parse_command(terminal.terminal.before_cursor());
    var relativePath = "";

    // Navigate to current directory
    var path = getAbsolutePath(terminal.fileSystem, terminal.currentDirectory["_parent"] + terminal.currentDirectory["_name"]);

    // Navigate to relative path
    var pathSegments = splitPath(input.rest);
    for (var i = 0; i < pathSegments.length; i++){

        if (pathSegments[i] == "" || pathSegments[i] == "."){
            continue;
        }
        else if (pathSegments[i] == ".."){
            path = getAbsolutePath(terminal.fileSystem, path['_parent']);
            relativePath += "../"
        }
        else{
            if (pathSegments[i] in path){
                path = path[pathSegments[i]];
                relativePath += pathSegments[i] + "/";
            }
            else{
                break;
            }
        }

    }

    // Add files to list of possible autofills
    var autofills = [];
    for (var entry in path){

        if (String(entry).startsWith("_")){
            continue;
        }
        else if (pathSegments.length == 0){
            autofills.push(path[entry]["_name"]);
        }
        else{
            autofills.push(relativePath + path[entry]["_name"]);
        }

    }

    console.log(autofills);
    return autofills;
}