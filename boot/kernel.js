// kernel.js - Responsible for initalizing and controlling the system.

import { FileSystem } from "../lib/modules/filesystem.js";
import { User } from "../lib/modules/user.js";

import { cat } from '../bin/cat.js';
import { cd } from '../bin/cd.js';
import { date } from '../bin/date.js';
import { echo } from '../bin/echo.js';
import { help } from '../bin/help.js';
import { history } from '../bin/history.js';
import { ls } from '../bin/ls.js';
import { pwd } from '../bin/pwd.js';
import { uname } from '../bin/uname.js';

try {
    window.cmdHistory = [];
    window.fileSystem = new FileSystem();
    window.cwd = window.fileSystem.clone();
    window.user = new User('guest', '');

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
    alert("Unable to load kernel, stopping window.");
    window.stop();
}
