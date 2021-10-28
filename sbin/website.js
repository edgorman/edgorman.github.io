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
});

// Terminal functions
window.cd = function cd(path){ 
    commands.cd(terminal, path);
}
