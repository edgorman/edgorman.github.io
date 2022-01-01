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

export function extractGetParameters(parameterName) {
    var parameters = window.top.location.search.substring(1).split("&");
    
    for (var index in parameters)
    {
        var keyValue = parameters[index].split("=");
        if (keyValue[0] == parameterName) return keyValue[1];
    }

    return null;
}

export function generateNavbarDropdown(elem, path, files){
    if (path == "/"){
        $(elem).append(`<a href="javascript:;" onclick="window.cd('/');">/</a>`);
    }
    else{
        $(elem).append(`<a href="javascript:;" onclick="window.cd('` + path + `');">` + splitPath(path).pop() + `</a>`);
        
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

export function generateContentDirectory(elem, path, files, keepSearch=false){
    if (!keepSearch){
        $(elem).empty();

        $(elem).append(`<div class="col-xl-4 order-xl-12"></div>`);
        $(elem).append(`<div class="col-xl-8 order-xl-1" style="min-height: 50vh;"></div>`);
        
        $(elem + ' .col-xl-4').append(`<div class="nav-bg mb-3 pt-3 pb-3 pl-2 pr-2"></div>`);
        $(elem + ' .nav-bg').append(`<form class="form-inline d-flex justify-content-center" id="directory-search"></form>`);
        $(elem + ' .nav-bg form').append(`<input class="form-control mr-2" type="search" placeholder="Search ..." aria-label="Search" id="filterEntriesInput" onkeyup="window.ls_search();">`);
        // $(elem + ' .nav-bg form').append(`<button class="btn btn-dark btn-sm" type="button" onclick="window.ls_search();"><i class="fas fa-search"></i></button>`);
        $(elem + ' .nav-bg form').append(`<div class="form-check mt-3 ml-3"><input class="form-check-input mr-3" type="checkbox" id="hideFilesCheck" onchange="window.ls_search()"><label class="form-check-label" for="hideFilesCheck">Hide Files</label></div>`);
        $(elem + ' .nav-bg form').append(`<div class="form-check mt-3 ml-3"><input class="form-check-input mr-3" type="checkbox" id="hideFoldersCheck" onchange="window.ls_search()"><label class="form-check-label" for="hideFoldersCheck">Hide Folders</label></div>`);
        $(elem + ' .nav-bg form').append(`<div class="form-check mt-3 ml-3"><label class="form-check-label" for="selectOrderDropdown">Order by</label><select class="ml-1" id="selectOrderDropdown" onchange="window.ls_search()"><option>Alphabetical</option><option>Date Asc.</option><option>Date Desc.</option></select></div>`);
    }
    
    $(elem + ' .col-xl-8').empty();
    $(elem + ' .col-xl-8').append(`<div class="list-group"></div>`);
    // if (path != "/" && $('#hideFoldersCheck').is(":checked")){
    //     $(elem + ' .list-group').append(`<a class="list-group-item list-group-item-action list-group-item-dark" href="javascript:;" onclick="window.cd('` + path + `');"><i class="far fa-folder"></i> .</a>`);
    //     $(elem + ' .list-group').append(`<a class="list-group-item list-group-item-action list-group-item-dark" href="javascript:;" onclick="window.cd('` + path + `/../');"><i class="far fa-folder"></i> . .</a>`);
    // }

    // Iterate across files twice, showing folders first then files after
    for (let i = 0; i < 2; i++){
        for (const file of files){
            if (!String(file["_name"]).startsWith(".")) {
                let onclick = "";
                let innerhtml = "";

                if (file["_type"] == "dir"){
                    if (i == 1) { continue; }
                    onclick = `window.cd('` + getFilePath(file) + `');`;
                    innerhtml = `<i class="fas fa-folder"></i>`;
                }
                else{
                    if (i == 0) { continue; }
                    onclick = `window.cat('` + getFilePath(file) + `');`;
                    innerhtml = `<i class="far fa-file"></i>`;
                }

                $(elem + ' .list-group').append(`<a class="list-group-item list-group-item-action list-group-item-dark d-flex justify-content-between" href="javascript:;" onclick="` + onclick + `"><span>` + innerhtml + file["_name"] + `</span><span class="text-secondary"><sub>` + file["_date"] + `</sub></span></a>`);
            }
        }
    }
}

export function generateContentFile(elem, content, file){
    $(elem).empty();

    if (file['_type'] == 'md'){
        $(elem).append(`<div class="col-xl-4 order-xl-12"></div>`);
        $(elem).append(`<div class="col-xl-8 order-xl-1 markdown">` + marked.parse(content) + `</div>`);
        
        $(elem + ' .col-xl-4').append(`<ul class="nav-bg p-3"><h3 class="mb-4">Page Contents</h3></ul>`);
        $(elem + ' .markdown [id]').each(function(i, el){
            $(elem + ' .nav-bg').append(`<li><a href="#` + el.id + `">` + el.innerHTML + `</a></li>`);
            $('#' + el.id).append(`<a href="#` + el.id + `" class="anchor"><i class="fas fa-link"></i></a>`);
        });

        $(elem + ' .markdown img').each(function(i, el){
            if (!el.attributes['src']['value'].startsWith("http") && 
                !el.attributes['src']['value'].startsWith("/")){
                el.src = file["_parent"] + el.attributes['src']['value'];
            }
        });

        // $(elem + ' .markdown code').each(function(i, el){
        //     console.log(el);
        // });
        // .append("<div class='copybutton' title='Copy content to clipboard' onclick='navigator.clipboard.writeText(`" + content + "`)'>Copy</div>");
    }
    else if (file['_type'] == 'jpg' || file['_type'] == 'jpeg' || file['_type'] == 'png'){
        $(elem).append(`<div class="col-xl-8 markdown">` + content + `</div>`);
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

        $(elem).append(`<div class="col"><pre></pre></div>`);

        // Special cases for content
        if (file['_type'] == "json"){
            content = JSON.stringify(content);
        }
        else if (c == "language-xml"){
            content = new XMLSerializer().serializeToString(content)
            content = content.replaceAll('<', '&lt;');
            content = content.replaceAll('>', '&gt;');
        }

        $(elem + ' pre').append(`<code class="` + c + `">` + content + `</code>`);
        // $(elem + ' pre').append("<div class='copybutton' title='Copy content to clipboard' onclick='navigator.clipboard.writeText(`" + content + "`)'>Copy</div>");
    }
    
}

export function generateFooterMessage(terminal, elem){
    $(elem).empty();

    $(elem).append(`<a href="https://github.com/edgorman">edgorman.github.io <i class="far fa-copyright"></i> ` + new Date().getFullYear() + `</a>`);
    $(elem).append(`<br>`);
    $(elem).append(`<a href="https://github.com/edgorman/edgorman.github.io/commit/` + terminal.gitHistory['commits'][0]['id'] + `" target="_blank" title="` + terminal.commitMessage + `">Last Commit (` + terminal.gitHistory['commits'][0]['id'] + `)</a>`);
}

export function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}