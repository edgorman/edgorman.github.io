/* 
utilities.js 

@edgorman 09-10-21
*/

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
