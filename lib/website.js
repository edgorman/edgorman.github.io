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
    }
    else{
        document.querySelector(`link[title="dark"]`).removeAttribute("disabled");
        document.querySelector(`link[title="light"]`).setAttribute("disabled", "disabled");
    }
}

var user;
var terminal;

$( document ).ready(function() {
    user = new User("guest", "", "/home/guest");
    terminal = new Terminal(user, "edgorman.github.io", "/srv/www/");

    // Update footer copyright and last commit message
    utilities.generateFooterMessage(terminal, '.footer p.mb-0');

    // To do: navigate to url path before 404 redirect
    window.cat("/srv/www/README.md");
});

window.cat = function cat(path){
    // Check the file path exists
    var newContent = commands.cat(terminal, path)[2][0];
    if (newContent.length == 1 && newContent[0] == ""){ return; }
    
    var newPath = utilities.getFilePath(utilities.getParentPath(terminal, path));
    var file = utilities.getPath(terminal, path);

    // Clear navbar
    $('.navbar-directory').empty();

    // Generate content for navbar
    var currentPath = "";
    for (const path of [currentPath].concat(utilities.splitPath(newPath))){
        currentPath += path + "/";

        utilities.generateNavbarDropdown(
            '.navbar-directory',
            currentPath,
            commands.ls(terminal, currentPath)[2]
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
            commands.ls(terminal, currentPath)[2]
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
        commands.ls(terminal, currentPath)[2]
    );
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
    commands.ls(terminal, path);
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