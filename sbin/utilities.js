/* 
utilities.js 

@edgorman 09-10-21
*/

export function generatePromptMessage(username, hostname, directory){
    return username + "@" + hostname + " " + directory + "\n$ "
}

export function generateGreetingMessage(username, hostname, commitMessage){
    return `Copyright (c) 2021 Edward Gorman` 
    + `\n<https://github.com/edgorman>`
    + `\n\nWelcome to https://`
    + hostname
    + `\n`
    + commitMessage
    + `\n\nYou are currently logged in as: [[b;;]` 
    + username
    + `]\nTo start, enter the command "[[b;;]help]"\n`
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