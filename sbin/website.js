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
    $('.content .col-lg-8').append(`<p>` + newContent + `</p>`);
}

// Terminal functions
window.cd = function cd(path){ 
    var newPath = commands.cd(terminal, path)[0];
    if (newPath == ""){ return; }

    // Update the navbar
    $('.navbar .breadcrumb').empty();
    var navbarContent, fileList;
    
    var currentPath = "/";
    for (const path of utilities.splitPath(newPath)){
        currentPath += path + "/";
        navbarContent = `<li class="breadcrumb-item"><a href="javascript:;" onclick="window.cd('` + currentPath + `');">` + path + `</a><div class="btn-group">
                         <button class="btn btn-link" id="` + currentPath + `Dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                         <i class="fas fa-sort-down" style="font-size: 12px; vertical-align: top; padding-top: 5px;"></i>
                         </button><div class="dropdown-menu" aria-labelledby="` + currentPath + `Dropdown">`;
        
        fileList = commands.ls(terminal, currentPath);
        
        for (const file of fileList){
            if (!String(file["_name"]).startsWith(".")) {
                if (file["_type"] == "dir"){
                    navbarContent += `<a class="dropdown-item" href="javascript:;" onclick="window.cd('` + utilities.getFilePath(file) + `');">` + file["_name"] + `</a>`
                }
                else{
                    navbarContent += `<a class="dropdown-item" href="javascript:;" onclick="window.cat('` + utilities.getFilePath(file) + `');">` + file["_name"] + `</a>`
                }
            }
        }

        navbarContent += `</div></div></li>`;
        $('.navbar .breadcrumb').append(navbarContent);
    }

    // Update the page content
    $('.content .col-lg-8').empty();
    fileList = commands.ls(terminal, currentPath);
    var mainContent = `<div class="list-group">`;
    mainContent += `<a class="list-group-item list-group-item-action list-group-item-dark" href="javascript:;" onclick="window.cd('` + newPath + `');">.</a>`;
    mainContent += `<a class="list-group-item list-group-item-action list-group-item-dark" href="javascript:;" onclick="window.cd('` + newPath + `/../');">. .</a>`;

    for (const file of fileList){
        if (!String(file["_name"]).startsWith(".")) {
            if (file["_type"] == "dir"){
                mainContent += `<a class="list-group-item list-group-item-action list-group-item-dark" href="javascript:;" onclick="window.cd('` + utilities.getFilePath(file) + `');">` + file["_name"] + `</a>`;
            }
            else{
                mainContent += `<a class="list-group-item list-group-item-action list-group-item-dark" href="javascript:;" onclick="window.cat('` + utilities.getFilePath(file) + `');">` + file["_name"] + `</a>`;
            }
        }
    }

    mainContent += `</div>`;
    $('.content .col-lg-8').append(mainContent);
}
