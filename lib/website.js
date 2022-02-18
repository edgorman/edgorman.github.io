import * as commands from '../bin/include.js';
import * as utilities from '../lib/utilities.js';
import { User } from '../lib/user.js';
import { Terminal } from '../lib/terminal.js';

$('.disabled').click(function(e){
    e.preventDefault();
});

window.toggleTheme = function toggleTheme(){
    $(document.documentElement).toggleClass('light-theme');

    if (document.documentElement.classList.contains('light-theme')){
        document.querySelector(`link[title="light"]`).removeAttribute("disabled");
        document.querySelector(`link[title="dark"]`).setAttribute("disabled", "disabled");
        utilities.setCookie("theme", "light");
    }
    else{
        document.querySelector(`link[title="dark"]`).removeAttribute("disabled");
        document.querySelector(`link[title="light"]`).setAttribute("disabled", "disabled");
        utilities.setCookie("theme", "dark");
    }
}

var user;
var terminal;
var history;

$( document ).ready(function() {
    // Set share link
    $('#shareMenuCollapse textarea').html(window.top.location.href);

    // Get user theme
    if (utilities.getCookie("theme") == "dark") { window.toggleTheme(); }

    // Check if user has been logged in already
    let username = utilities.getCookie("user");
    let password = "";
    if (username == "" || username == "guest"){ username = "guest"; }
    else{ password = prompt("Welcome " + username + ", what is your password?"); }
    utilities.setCookie("user", username);

    // Initialise user and terminal
    user = new User(username, password, "/home/" + username);
    terminal = new Terminal(user, "edgorman.github.io", window.top.location.pathname.replaceAll("%20", " "));

    // Update footer copyright and last commit message
    utilities.generateFooterMessage(terminal, '.footer p.mb-0');

    // Change directory to url
    history = [];
    window.cd_url();
});

window.addEventListener('popstate', function(event) {
    history.pop();
    var popUrl = history.length > 0 ? history[history.length - 1] : "/";
    window.top.history.pushState({}, popUrl, popUrl);
    window.cd_url();
    history.pop();
})

window.cat = function cat(path){
    // Check the file path exists
    var newContent = commands.cat(terminal, path);
    if (newContent[2].length == 0){ 
        alert("Error: Could not find '" + path + "'.\nRedirecting to the root directory.");
        window.cd('/');
        return;
    }
    
    // Get the url path 
    var newPath = utilities.getFilePath(utilities.getParentPath(terminal, path));
    var file = utilities.getPath(terminal, path);
    var urlPath = newPath + "/?f=" + file["_name"];
    urlPath = urlPath.replace("//", "/");
    var startHash = window.top.location.hash;
    urlPath += startHash;

    history.push(urlPath);
    window.top.history.pushState({}, urlPath, urlPath);
    window.parent.document.title = utilities.getFilePath(file);

    // Clear navbar
    $('.navbar-directory').empty();

    // Generate content for navbar
    var currentPath = "";
    for (const path of [currentPath].concat(utilities.splitPath(newPath))){
        currentPath += path + "/";

        utilities.generateNavbarDropdown(
            '.navbar-directory',
            currentPath,
            commands.ls(terminal, currentPath)[0]
        )
    }

    // Generate content for metadata
    utilities.generateContentMetadata(
        '.metadata',
        file
    )

    // Generate content for content
    utilities.generateContentFile(
        '.content',
        newContent[2],
        file
    )

    // Highlight any code in page
    hljs.highlightAll();

    location.hash = startHash;
    return newContent;
}

window.cd = function cd(path){ 
    // Check the new path exists
    var newPath = commands.cd(terminal, path);
    if (newPath[2].length == 0){ 
        alert("Error: Could not find '" + path + "'.\nRedirecting to the root directory.");
        window.cd('/');
        return;
    }

    history.push(newPath[2]);
    window.top.history.pushState({}, newPath[2], newPath[2]);
    window.parent.document.title = newPath[2];

    // Update file display
    window.ls(newPath[2]);
    return newPath;
}

window.cd_url = function cd_url(){
    // Replace html encoding with real characters
    var startPath = window.top.location.pathname;
    startPath = startPath.replaceAll("%20", " ");
    var startFile = utilities.extractGetParameters("f");
    var startHash = window.top.location.hash;

    if (startFile != null){
        // Cat file if in url
        window.cat(startFile);
        location.hash = startHash;
    }
    else
    {
        // Extract filters from GET params
        let searchFilter = utilities.extractGetParameters("fs");
        let searchFiles = utilities.extractGetParameters("fi");
        let searchFolders = utilities.extractGetParameters("ff");
        let searchOrder = utilities.extractGetParameters("fo");

        // Change user to directory in url
        window.cd(startPath);

        if (searchFilter != null || searchFiles != null || searchFolders != null || searchOrder != null)
        {
            $('#collapseDirectorySearch').toggleClass('show');

            $('#filterEntriesInput').val(searchFilter);
            if (searchFiles != null) { $('#hideFilesCheck').prop("checked", true); }
            if (searchFolders != null) { $('#hideFoldersCheck').prop("checked", true); }
            if (searchOrder != null) { $('#selectOrderDropdown').val(searchOrder.replace("%20", " ")); }

            window.ls_search();
        }
    }
}

window.date = function date(){
    return commands.date(terminal);
}

window.debug_ = function debug(){
    return commands.debug(terminal);
}

window.echo = function echo(message){
    return commands.echo(terminal, message);
}

window.exit = function exit(){
    if (confirm("Are you sure you want to close the website?\n\nAll file changes will be lost.")) {
        close();
    }
}

window.help = function help(){
    return commands.help(terminal);
}

window.history_ = function history(){
    return commands.history(terminal);
}

window.ls = function ls(path){
    if (path == undefined || path.length == 0){ path = "."; }
    if (path.constructor === Array){ path = path[0]; }

    // Check the new path exists
    path = path.replaceAll(" ", "\\ ");
    var newPath = commands.ls(terminal, path);
    if (newPath[2] == []){ return; }

    // Clear navbar and content
    $('.navbar-directory').empty();
    $('.content').empty();

    // Generate content for navbar
    var currentPath = "";
    for (const path of [currentPath].concat(utilities.splitPath(newPath[2]))){
        currentPath += path + "/";

        utilities.generateNavbarDropdown(
            '.navbar-directory',
            currentPath,
            commands.ls(terminal, '"' + currentPath + '"')[0]
        )
    }

    // Generate content for metadata
    utilities.generateContentMetadata(
        '.metadata',
        utilities.getPath(terminal, currentPath)
    )

    // Generate content for content
    utilities.generateContentDirectory(
        '.content',
        currentPath,
        commands.ls(terminal, '"' + currentPath + '"')[0]
    );

    return newPath;
}

window.ls_search = function ls_search(){
    var filterValue = $('#filterEntriesInput').val();
    var hideFiles = $('#hideFilesCheck').is(":checked");
    var hideFolders = $('#hideFoldersCheck').is(":checked");
    var sortByType = $('#selectOrderDropdown').val();

    // Get filter flag from search input
    var filterFlag = "";
    if (filterValue.length > 0){
        filterFlag = " -s " + filterValue;
    }

    // Get sort flag from dropdown input
    var sortFlag;
    switch(sortByType){
        case 'Alphabetical': sortFlag = " -a"; break;
        case 'Date Asc.': sortFlag = " -d"; break;
        case 'Date Desc.': sortFlag = " -D"; break;
        default: sortFlag = "";
    }

    // Get list of files
    var files = commands.ls(terminal, '.' + sortFlag + filterFlag)[0];
    var searchFiles = [];

    // Show/hide files and directories
    for (let i = 0; i < files.length; i++)
    {
        if(files[i]['_type'] != "dir" && !hideFiles ||
           files[i]['_type'] == "dir" && !hideFolders){
            searchFiles.push(files[i]);
        }
    }

    // Generate content for content
    utilities.generateContentDirectory(
        '.content',
        '.',
        searchFiles,
        true
    );

    // Update get parameters
    var newPath = utilities.getFilePath(terminal.currentDirectory);
    var getParams = []
    if ($('#filterEntriesInput').val() != "") { getParams.push("fs=" + $('#filterEntriesInput').val()); }
    if ($('#hideFilesCheck').is(":checked")) { getParams.push("fi=true"); }
    if ($('#hideFoldersCheck').is(":checked")) { getParams.push("ff=true"); }
    if ($('#selectOrderDropdown').val() != "Alphabetical") { getParams.push("fo=" + $('#selectOrderDropdown').val()); }
    var getPath = getParams.length > 0 ? "?" + getParams.join('&') : "";

    window.top.history.pushState({}, newPath, newPath + getPath);
}

window.pwd = function pwd(){
    return commands.pwd(terminal);
}

window.touch = function touch(path){
    return commands.touch(terminal, path);
}

window.uname = function uname(){
    return commands.uname(terminal);
}

window.whoami = function whoami(){
    return commands.whoami(terminal);
}