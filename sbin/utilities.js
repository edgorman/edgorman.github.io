/* 
utilities.js 

@edgorman 09-10-21
*/

export function onExceptionThrown(terminal, exception){
    console.error("ERROR: " + exception);
    terminal.echo(["[[;red;]Error: " + exception + "]", ""]);
}

export function onCommandNotFound(terminal, command){
    onExceptionThrown(terminal, "Command not found '" + command + "'");
}

export function generatePromptMessage(terminal, directory){
    if (String(directory).startsWith(terminal.user.homeDirectory)){
        directory = String(directory).replace(terminal.user.homeDirectory, "~");
    }

    return "[[;#7bd833;]" + terminal.user.name + "@" + terminal.hostname + "]:[[;#5b88df;]" + directory + "]$ ";
}

export function generateGreetingMessage(terminal){
    return `Copyright (c) `
    + (1900 + new Date().getYear())
    + ` Edward Gorman <https://github.com/edgorman>`
    + `\nLast login: `
    + Date();
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

export function loadFile(path){
    var result;

    $.ajax({
        url: path,
        cache: false,
        async: false,
        success:function(data) {
            result = data;
            console.info("INFO: Successfully loaded " + path + ".");
        }
        }).fail(function() {
            console.error("ERROR: Failed to retrieve " + path + ".");
            window.stop();
        }
    );
    
    return result;
}

export function loadFileSystem(fileSystemPath){
    return loadFile(fileSystemPath);
}

export function loadGitHistory(gitHistoryPath){
    return loadFile(gitHistoryPath);
}

export function createFile(terminal, parentPath, filename){
    try{
        var date = new Date();
        var extension = "txt";
    
        if (String(filename).includes('.')){
            extension = filename.split('.').pop();
        }
    
        terminal.fileSystem[parentPath][filename] = {
            "_name": filename, 
            "_date": date.getDate() + "/" + date.getMonth() + "/" + (1900 + date.getYear()),
            "_time": date.getHours() + ":" + date.getMinutes(), 
            "_type": extension, 
            "_parent": parentPath
        }

        return true;
    }
    catch (e){
        return false;
    }
}

export function splitPath(path){
    if (String(path).startsWith("/"))
        path = path.substring(1, path.length);
    
    if (String(path).endsWith("/"))
        path = path.substring(0, path.length - 1);

    if (path == "") return [];
    else return String(path).split(/[\\/]/);
}

export function getFilePath(file){
    return file["_parent"] + file["_name"];
}

export function getAbsolutePath(terminal, absolutePath){
    // Assumes the absolute path must exist
    var path = terminal.fileSystem["/"];
    
    var pathSegments = splitPath(absolutePath);
    for (var i = 0; i < pathSegments.length; i++){
        path = path[pathSegments[i]];
    }

    return path;
}

export function getParentPath(terminal, relativePath){
    var pathSegments = splitPath(relativePath);
    var parentPath =  pathSegments.slice(0, pathSegments.length - 1).join('/');

    if (String(relativePath).startsWith("/")){
        parentPath = "/" + parentPath;
    }

    if (String(relativePath).startsWith("~") && !String(relativePath).startsWith("~/")){
        parentPath = "~/" + parentPath;
    }

    return getPath(terminal, parentPath);
}

export function getPath(terminal, relativePath){
    var currentDirectory = terminal.currentDirectory;

    // If path is empty
    if (relativePath == undefined){
        relativePath = ".";
    }

    // If path starts with root
    if (String(relativePath).startsWith("/")){
        currentDirectory = terminal.fileSystem["/"];
        relativePath = String(relativePath).substring(1, relativePath.length);
    }

    // If path starts with home
    if (String(relativePath).startsWith("~")){
        currentDirectory = getAbsolutePath(terminal, terminal.user.homeDirectory);
        relativePath = String(relativePath).substring(1, relativePath.length);
    }

    // Navigate to current directory
    var path = getAbsolutePath(terminal, getFilePath(currentDirectory));

    // Navigate to relative path
    var pathSegments = splitPath(relativePath);
    for (var i = 0; i < pathSegments.length; i++){

        if (pathSegments[i] == "" || pathSegments[i] == "."){
            continue;
        }
        else if (pathSegments[i] == ".."){
            path = getAbsolutePath(terminal, path['_parent']);
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
    var remainingPath = $.terminal.parse_command(terminal.terminal.before_cursor()).rest;
    var path = getParentPath(terminal, remainingPath);
    var pathSegments = splitPath(path);

    // Add files to list of possible autofills
    var autofills = [];
    for (var entry in path){
        if (!String(entry).startsWith("_")){
            if (pathSegments.length == 1){
                autofills.push(path[entry]["_name"]);
            }
            else{
                autofills.push(pathSegments.slice(0, pathSegments.length - 1).join("/") + path[entry]["_name"]);
            }
        }
    }

    return autofills;

    // return autofills;

    // var relativePath = "";
    // var currentDirectory = terminal.currentDirectory["_parent"] + terminal.currentDirectory["_name"];

    // // If path starts with root
    // if (String(input.rest).startsWith("/")){
    //     currentDirectory = "/";
    // }

    // // Navigate to current directory
    // var path = getAbsolutePath(terminal, getFilePath(terminal.currentDirectory));

    // // Navigate to relative path
    // var pathSegments = splitPath(input.rest);
    // for (var i = 0; i < pathSegments.length; i++){

    //     if (pathSegments[i] == "" || pathSegments[i] == "."){
    //         continue;
    //     }
    //     else if (pathSegments[i] == ".."){
    //         path = getAbsolutePath(terminal.fileSystem, path['_parent']);
    //         relativePath += "../"
    //     }
    //     else{
    //         if (pathSegments[i] in path){
    //             path = path[pathSegments[i]];
    //             relativePath += pathSegments[i] + "/";
    //         }
    //         else{
    //             break;
    //         }
    //     }

    // }

    // // Add files to list of possible autofills
    // var autofills = [];
    // for (var entry in path){

    //     if (String(entry).startsWith("_") || entry == "." || entry == ".."){
    //         continue;
    //     }
    //     else if (pathSegments.length == 0){
    //         autofills.push(path[entry]["_name"]);
    //     }
    //     else{
    //         autofills.push(relativePath + path[entry]["_name"]);
    //     }

    // }

    // return autofills;
    return ['test'];
}

export function generateNavbarDropdown(elem, path, files){
    if (path != "/"){
        $(elem).append(`<a href="javascript:;" onclick="window.cd('` + path + `');">` + splitPath(path).pop() + `</a>`);
    }
    
    let dropdownId = path + "Dropdown";
    $(elem).append(`<div class="btn-group"></div>`);
    $(elem + ' .btn-group').last().append(`<button id="` + dropdownId + `" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">/</button>`);
    $(elem + ' .btn-group').last().append(`<div class="dropdown-menu" aria-labelledby="` + dropdownId + `"></div>`);
    
    for (const file of files){
        if (!String(file["_name"]).startsWith(".")) {
            if (file["_type"] == "dir"){
                $(elem + ' .dropdown-menu').last().append(`<a class="dropdown-item" href="javascript:;" onclick="window.cd('` + getFilePath(file) + `');">` + file["_name"] + `</a>`);
            }
            else{
                $(elem + ' .dropdown-menu').last().append(`<a class="dropdown-item" href="javascript:;" onclick="window.cat('` + getFilePath(file) + `');">` + file["_name"] + `</a>`);
            }
        }
    }
}

export function generateContentMetadata(elem, file){
    $(elem + ' p').empty();
    $(elem + ' p').append(file["_name"]);

    if (file["_type"] == "dir"){
        $(elem + ' .align-items-left a').attr('onclick', 'window.cd("../");');
    }
    else{
        $(elem + ' .align-items-left a').attr('onclick', 'window.cd(".");');
    }
}

export function generateContentDirectory(elem, path, files){
    $(elem).empty();

    $(elem).append(`<div class="col-xl-8"><div class="list-group"></div></div>`);
    if (path != "/"){
        $(elem + ' .list-group').append(`<a class="list-group-item list-group-item-action list-group-item-dark" href="javascript:;" onclick="window.cd('` + path + `');"><i class="far fa-folder"></i> .</a>`);
        $(elem + ' .list-group').append(`<a class="list-group-item list-group-item-action list-group-item-dark" href="javascript:;" onclick="window.cd('` + path + `/../');"><i class="far fa-folder"></i> . .</a>`);
    }

    for (const file of files){
        if (!String(file["_name"]).startsWith(".")) {
            let onclick = `window.cat('` + getFilePath(file) + `');`;
            let innerhtml = `<i class="far fa-file"></i>` + file["_name"];

            if (file["_type"] == "dir"){
                onclick = `window.cd('` + getFilePath(file) + `');`;
                innerhtml = `<i class="far fa-folder"></i>` + file["_name"];
            }

            $(elem + ' .list-group').append(`<a class="list-group-item list-group-item-action list-group-item-dark" href="javascript:;" onclick="` + onclick + `">` + innerhtml + `</a>`);
        }
    }
}

export function generateContentFile(elem, content, file){
    $(elem).empty();

    if (file['_type'] == 'md'){
        $(elem).append(`<div class="col-xl-8">` + marked.parse(content) + `</div>`);
    }
    else if (file['_type'] == 'jpeg' || file['_type'] == 'png'){
        $(elem).append(`<div class="col-xl-8">` + content + `</div>`);
    }
    else{
        var c = "language-";
        switch (file['_type']){
            case 'py': c += "python"; break;
            case 'js': c += "javascript"; break;
            case 'html': c += "xml"; break;
            case 'sh': c += "bash"; break;
            case 'cpp': c += "cpp"; break;
            case 'cs': c += "csharp"; break;
            case 'css': c += "css"; break;
            case 'java': c += "java"; break;
            case 'json': c += "json"; break;
            case 'php': c += "php"; break;
            case 'r': c += "r"; break;
            case 'sql': c += "sql"; break;
            case 'xml': c += "xml"; break;
            case 'yml': c += "yaml"; break;
            case 'yaml': c += "yaml"; break;
            default: c += "plaintext"; break;
        }

        if (file['_type'] == "json"){
            $(elem).append(`<pre><code class="` + c + `">` + JSON.stringify(content) + `</pre></code>`);
        }
        else if (c == "language-xml"){
            content = new XMLSerializer().serializeToString(content)
            content = content.replaceAll('<', '&lt;');
            content = content.replaceAll('>', '&gt;');
            $(elem).append(`<pre><code class="` + c + `">` + content + `</pre></code>`);
        }
        else if (typeof(content) == "string"){
            $(elem).append(`<pre><code class="` + c + `">` + content + `</pre></code>`);
        }
        else{
            $(elem).append(`<plaintext>`);
            $(elem + ' plaintext').append(content);
        }
    }
    
}

export function generateFooterMessage(terminal, elem){
    $(elem).empty();

    $(elem).append(`<a href="https://github.com/edgorman">edgorman.github.io <i class="far fa-copyright"></i> ` + new Date().getFullYear() + `</a>`);
    $(elem).append(`<br>`);
    $(elem).append(`<a href="https://github.com/edgorman/edgorman.github.io/commit/` + terminal.gitHistory['commits'][0]['id'] + `" target="_blank">` + terminal.commitMessage + `</a>`);
}
