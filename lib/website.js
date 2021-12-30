import * as commands from '../bin/include.js';
import * as utilities from '../sbin/utilities.js';
import { User } from '../sbin/user.js';
import { Terminal } from '../sbin/terminal.js';

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

$( document ).ready(function() {
    // Get user theme
    if (utilities.getCookie("theme") == "dark") { window.toggleTheme(); }

    // Set share link
    $('#shareMenuCollapse textarea').html(window.top.location.href);

    // Replace html encoding with real characters
    var startPath = window.top.location.pathname;
    startPath = startPath.replace("%20", " ");
    var startFile = utilities.extractGetParameters("f");
    var startHash = window.top.location.hash;

    // Check if user has been logged in already
    let username = utilities.getCookie("user");
    let password = "";
    if (username == "" || username == "guest"){ username = "guest"; }
    else{ password = prompt("Welcome " + username + ", what is your password?"); }
    utilities.setCookie("user", username);

    // Initialise user and terminal
    user = new User(username, password, "/home/" + username);
    terminal = new Terminal(user, "edgorman.github.io", startPath);

    // Update footer copyright and last commit message
    utilities.generateFooterMessage(terminal, '.footer p.mb-0');

    // Change user to directory in url
    window.cd(startPath);

    // Cat file if in url
    if (startFile != null){
        window.cat(startFile);
        location.hash = startHash;
    }
});

window.addEventListener('popstate', function(event) {
    // Replace html encoding with real characters
    var startPath = window.top.location.pathname;
    startPath = startPath.replace("%20", " ");
    var startFile = utilities.extractGetParameters("f");
    var startHash = window.top.location.hash;

    // Change user to directory in url
    window.cd(startPath);

    // Cat file if in url
    if (startFile != null){
        window.cat(startFile);
        location.hash = startHash;
    }
})

window.cat = function cat(path){
    // Check the file path exists
    var newContent = commands.cat(terminal, path)[2][0];
    if (newContent.length == 1 && newContent[0] == ""){ return; }
    
    // Get the url path 
    var newPath = utilities.getFilePath(utilities.getParentPath(terminal, path));
    var file = utilities.getPath(terminal, path);
    var urlPath = newPath + "/?f=" + file["_name"];
    urlPath = urlPath.replace("//", "/");

    window.top.history.pushState({}, urlPath, urlPath);
    window.parent.document.title = utilities.getFilePath(file);
    $('#shareMenuCollapse textarea').html(window.top.location.href);

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
        newContent,
        file
    )

    // Highlight any code in page
    hljs.highlightAll();
}

window.cd = function cd(path){ 
    // Check the new path exists
    var newPath = commands.cd(terminal, path)[2][0];
    if (newPath == ""){ return; }

    window.top.history.pushState({}, newPath, newPath);
    window.parent.document.title = newPath;
    $('#shareMenuCollapse textarea').html(window.top.location.href);

    // Update file display
    window.ls(newPath);
}

window.date = function date(){
    commands.date(terminal);
}

window.debug_ = function debug(){
    commands.debug(terminal);
}

window.echo = function echo(message){
    commands.echo(terminal, message);
}

window.exit = function exit(){
    if (confirm("Are you sure you want to close the website?\n\nAll file changes will be lost.")) {
        close();
    }
}

window.help = function help(){
    commands.help(terminal);
}

window.history_ = function history(){
    commands.history(terminal);
}

window.ls = function ls(path){
    // Check the new path exists
    var newPath = commands.ls(terminal, path)[2];
    if (newPath == ""){ return; }

    // Clear navbar and content
    $('.navbar-directory').empty();
    $('.content').empty();

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
        utilities.getPath(terminal, currentPath)
    )

    // Generate content for content
    utilities.generateContentDirectory(
        '.content',
        currentPath,
        commands.ls(terminal, currentPath)[0]
    );
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
}

window.pwd = function pwd(){
    commands.pwd(terminal);
}

window.touch = function touch(path){
    commands.touch(terminal, path);
}

window.uname = function uname(){
    commands.uname(terminal);
}

window.whoami = function whoami(){
    commands.whoami(terminal);
}