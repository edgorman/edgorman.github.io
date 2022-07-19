// kernel.js - Responsible for initalizing and controlling the system.

import { FileSystem } from "../lib/modules/filesystem.js";
import { User } from "../lib/modules/user.js";
import { Terminal } from "../usr/bin/terminal.js";
import { Browser } from "../usr/bin/browser.js";
import { cat } from '../bin/cat.js';
import { cd } from '../bin/cd.js';
import { date } from '../bin/date.js';
import { echo } from '../bin/echo.js';
import { help } from '../bin/help.js';
import { history } from '../bin/history.js';
import { ls } from '../bin/ls.js';
import { pwd } from '../bin/pwd.js';
import { uname } from '../bin/uname.js';


// On system startup
$( document ).ready(function() {
    window.cmdHistory = [];

    // Load the file system
    try {
        window.fileSystem = new FileSystem();
        window.cwd = window.fileSystem.clone();
    } catch (e) {
        alert(e);
        alert("Unable to load the filesystem, stopping window.");
        return;
    }

    // Load user settings
    try {
        window.user = new User('guest', '');
    } catch (e) {
        alert(e);
        alert("Unable to login the user, stopping window.");
        return;
    }

    // Create kernel commands
    try {
        window.cat = cat;
        window.cd = cd;
        window.date = date;
        window.echo = echo;
        window.help = help;
        window.history_ = history;
        window.ls = ls;
        window.pwd = pwd;
        window.uname = uname;
    } catch (e) {
        alert(e);
        alert("Unable to assign commands to kernel, stopping window.");
        return;
    }

    // Create terminal process
    try {
        window.terminal = new Terminal();
    } catch (e) {
        alert(e);
        alert("Unable to create terminal, stopping window.");
        return;
    }

    // Create browser process
    try {
        window.browser = new Browser();
    } catch (e) {
        alert(e);
        alert("Unable to create browser, stopping window.");
        return;
    }

    // Load path from window URL

});
