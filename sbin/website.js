import * as commands from '../bin/include.js';
import * as utilities from '../sbin/utilities.js';
import { User } from '../sbin/user.js';
import { Terminal } from '../sbin/terminal.js';

$('.disabled').click(function(e){
    e.preventDefault();
});
        
var user;
var terminal;

$( document ).ready(function() {
    user = new User("guest", "", "/home/guest");
    terminal = new Terminal(user, "edgorman.github.io");

    window.cd("/srv/www/");
});

window.cat = function cat(path){
    var newContent = commands.cat(terminal, path);
    if (newContent.length == 1 && newContent[0] == ""){ return; }
    $('.content .col-lg-8').empty();

    $('.content .col-lg-8').append(`<pre><code class="language-python">` + newContent + `</pre></code>`);
    hljs.highlightAll();
}

window.cd = function cd(path){ 
    // Check the new path exists
    var newPath = commands.cd(terminal, path);
    if (newPath == ""){ return; }

    // Clear navbar and content
    $('.navbar-directory').empty();
    $('.content .col-lg-8').empty();

    // Generate content for navbar
    var currentPath = "";
    for (const path of [currentPath].concat(utilities.splitPath(newPath))){
        currentPath += path + "/";

        utilities.generateNavbarDropdown(
            '.navbar-directory',
            currentPath,
            commands.ls(terminal, currentPath)
        )
    }

    // Generate content for content
    utilities.generateContentDirectory(
        '.content .col-lg-8',
        currentPath,
        commands.ls(terminal, currentPath)
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