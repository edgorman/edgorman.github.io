import * as commands from '../bin/include.js';
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

function cd(path){ commands.cd(terminal, path); }
window.cd = cd;
