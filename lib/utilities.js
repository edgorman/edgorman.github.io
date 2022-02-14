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

        $(elem + ' .col-xl-4').append(`<div class="nav-bg mb-3 p-3"></div>`);
        $(elem + ' .nav-bg').append(`<div class="d-flex justify-content-between" style="cursor:pointer;" data-toggle="collapse" href="#collapseHelpSidebar" role="button" aria-expanded="false" aria-controls="collapseHelpSidebar"><b><i class="fas fa-question-circle"></i> How to use this site</b><i class="fas fa-chevron-down pt-2 pr-2"></i></div>`);
        $(elem + ' .nav-bg').append(`<div class="collapse pt-3" id="collapseHelpSidebar"></div>`);
        $(elem + ' .nav-bg .collapse').append(`<p>This site works like a file system, allowing you to navigate through all folders and read every line of code that went into making it.</p>`)
        $(elem + ' .nav-bg .collapse').append(`<p>Try clicking on a file or folder to see what's inside, or click the <small><i class="fas fa-level-up-alt fa-flip-horizontal pl-1 pr-1"></i></small> icon to go up a directory.</p>`)
        $(elem + ' .nav-bg .collapse').append(`<a href="/home/eg/introduction/?f=README.md" style="font-weight: bold;">Click here to visit the introduction page.</a>`)

        $(elem + ' .col-xl-4').append(`<div class="nav-bg mb-3 p-3"></div>`);
        $(elem + ' .nav-bg:nth-child(2)').append(`<div class="d-flex justify-content-between" style="cursor:pointer;" data-toggle="collapse" href="#collapseDirectorySearch" role="button" aria-expanded="false" aria-controls="collapseDirectorySearch"><b><i class="fas fa-filter"></i> Filter results</b><i class="fas fa-chevron-down pt-2 pr-2"></i></div>`);
        $(elem + ' .nav-bg:nth-child(2)').append(`<div class="collapse pt-3" id="collapseDirectorySearch"></div>`);
        $(elem + ' .nav-bg:nth-child(2) .collapse').append(`<form class="form-inline d-flex justify-content-center" id="directory-search"></form>`);
        $(elem + ' .nav-bg:nth-child(2) form').append(`<input class="form-control mr-2" type="search" placeholder="Search this directory..." aria-label="Search" id="filterEntriesInput" onkeyup="window.ls_search();">`);
        $(elem + ' .nav-bg:nth-child(2) form').append(`<div class="form-check mt-3 ml-3"><input class="form-check-input mr-3" type="checkbox" id="hideFilesCheck" onchange="window.ls_search()"><label class="form-check-label" for="hideFilesCheck">Hide Files</label></div>`);
        $(elem + ' .nav-bg:nth-child(2) form').append(`<div class="form-check mt-3 ml-3"><input class="form-check-input mr-3" type="checkbox" id="hideFoldersCheck" onchange="window.ls_search()"><label class="form-check-label" for="hideFoldersCheck">Hide Folders</label></div>`);
        $(elem + ' .nav-bg:nth-child(2) form').append(`<div class="form-check mt-3 ml-3"><label class="form-check-label" for="selectOrderDropdown">Order by</label><select class="ml-1" id="selectOrderDropdown" onchange="window.ls_search()"><option>Alphabetical</option><option>Date Asc.</option><option>Date Desc.</option></select></div>`);
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
                    if (i == 0) { continue; }
                    onclick = `window.cd('` + getFilePath(file).replace(" ", "\\ ") + `');`;
                    innerhtml = `<i class="fas fa-folder"></i>`;
                }
                else if (file["_type"] == "png" || file["_type"] == "jpg" || file["_type"] == "jpeg")
                {
                    if (i == 1) { continue; }
                    onclick = `window.cat('` + getFilePath(file).replace(" ", "\\ ") + `');`;
                    innerhtml = `<i class="far fa-file-image"></i>`;
                }
                else{
                    if (i == 1) { continue; }
                    onclick = `window.cat('` + getFilePath(file).replace(" ", "\\ ") + `');`;
                    innerhtml = `<i class="far fa-file"></i>`;
                }

                $(elem + ' .list-group').append(`<a class="list-group-item list-group-item-action list-group-item-dark d-flex justify-content-between" href="javascript:;" onclick="` + onclick + `"><span>` + innerhtml + file["_name"] + `</span><span class="text-secondary"><sub>` + file["_date"] + `</sub></span></a>`);
            }
        }
    }
}

export function generateContentFile(elem, content, file){
    $(elem).empty();
    var supportedLanguages = ['py', 'js', 'sh', 'cpp', 'cs', 'css', 'java', 'csv',
                              'php', 'sql', 'r', 'yaml', 'yml', 'txt', 'LICENSE',
                              'html', 'xml', 'tres', 'import', 'godot', 'tscn', 'gd'];

    if (file['_type'] == 'md'){
        $(elem).append(`<div class="col-xl-4 order-xl-12"></div>`);
        $(elem).append(`<div class="col-xl-8 order-xl-1 markdown">` + marked.parse(content) + `</div>`);
        
        $(elem + ' .col-xl-4').append(`<div class="nav-bg p-3"></div>`);
        $(elem + ' .nav-bg').append(`<div class="d-flex justify-content-between" style="cursor:pointer;" data-toggle="collapse" href="#collapseHelpSidebar" role="button" aria-expanded="false" aria-controls="collapseHelpSidebar"><b><i class="fas fa-stream"></i> Page Contents</b><i class="fas fa-chevron-down pt-2 pr-2"></i></div>`);
        $(elem + ' .nav-bg').append(`<div class="collapse show pt-2" id="collapseHelpSidebar"><ul class="pl-1 mb-0"></ul></div>`);
        $(elem + ' .markdown [id]').each(function(i, el){
            $(elem + ' .nav-bg ul').append(`<li><a href="#` + el.id + `">` + el.innerHTML + `</a></li>`);
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
    else if (supportedLanguages.includes(file['_type']))
    {
        if (file['_type'] == "html" || file['_type'] == "xml"){
            if (file['_type'] == "xml")
            {
                content = new XMLSerializer().serializeToString(content)
            }
            content = content.replaceAll('<', '&lt;');
            content = content.replaceAll('>', '&gt;');
        }

        $(elem).append(`<div class="col"><pre></pre></div>`);
        $(elem + ' pre').append(`<code>` + content + `</code>`);
        hljs.highlightAll();
    }
    else
    {
        $(elem).append(`<div class="col"></div>`);
        $(elem + ' .col').append(`<iframe style="width: 100%; min-height: 100vh;" src="` + getFilePath(file) + `"/>`);
    }
}

export function generateFooterMessage(terminal, elem){
    $(elem).empty();

    $(elem).append(`<span>edgorman.github.io <i class="far fa-copyright"></i> ` + new Date().getFullYear() + `</span>`);
    $(elem).append(`<br>`);
    $(elem).append(`<a href="https://github.com/edgorman/edgorman.github.io/commit/` + terminal.gitHistory['commits'][0]['id'] + `" target="_blank" title="` + terminal.commitMessage + `">v.` + terminal.gitHistory['commits'][0]['id'] + `</a>`);
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