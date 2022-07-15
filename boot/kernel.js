// kernel.js - Responsible for initalizing and controlling the system.

import { Terminal } from "../usr/bin/terminal.js";
import { cat } from '../bin/cat.js';
import { cd } from '../bin/cd.js';
import { date } from '../bin/date.js';
import { echo } from '../bin/echo.js';
import { help } from '../bin/help.js';
import { history } from '../bin/history.js';
import { ls } from '../bin/ls.js';
import { pwd } from '../bin/pwd.js';
import { uname } from '../bin/uname.js';


class FileSystem {
    // File is an object that stores files and directories in an object focused manner.
    // The name parameter decides which entry to recursively create file objects from next,
    // And the parent paramter gives access to this file objects parent for easy file traversal.
    constructor(name = '', parent = null, data = null) {
        if (parent == null){
            var file = this.loadFile('/proc/filesystem')

            name = '/';
            parent = this;
            data = JSON.parse(file)[name];
        }

        this.name = name;
        this.parent = parent;
        this.data = data;
        this.date = data["date"];
        this.time = data["time"];
        this.type = data["type"];

        this.children = {};
        if ("children" in data){
            for(const [n, o] of Object.entries(data["children"])){
                this.children[n] = new FileSystem(n, this, o);
            }
        }
    }

    getAbsolutePath(){
        // Recurse up parent chain and add name to the path until reach root
        if (this.name == '/'){
            return "/";
        }
        else if (this.type == "dir"){
            return this.parent.getAbsolutePath() + this.name + "/";
        }
        else{
            return this.parent.getAbsolutePath() + this.name;
        }
    }

    clone(){
        // Clone a filesystem object by pass by value rather than reference
        return new FileSystem(this.name, this.parent, this.data);
    }

    loadFile(path){
        // Load a file from the current path and return the result or null if request failed.
        var file = "";
        $.ajax({
            url: path,
            cache: false,
            async: false,
            success: function(data) {
                file = data;
            }
            }).fail(function() {
                throw 'Could not load file "' + path + '" from the local file system.';
            }
        );
        return file;
    }

    loadPath(path){
        // Navigate to a given path, throwing errors if the move is not possible.
        var tmpCwd = this.clone();

        // If path is undefined, return current cwd
        if (path == undefined) {
            return tmpCwd;
        }
        path = String(path);
        
        // If path starts with root
        if (path.startsWith("/")){ 
            tmpCwd = window.fileSystem.clone();
            path = path.substring(1, path.length);
        }
    
        // If path starts with home directory
        if (path.startsWith("~")) {
            tmpCwd = window.fileSystem.clone();
            tmpCwd = tmpCwd.children['home'];
            tmpCwd = tmpCwd.children[window.user.name];
            path = path.substring(1, path.length);
        }
    
        // If path is empty or itself, return cwd
        if (path == "" || path == ".") {
            return tmpCwd;
        }
    
        // Iterate through path checking to see if jump is valid
        var segments = path.split("/");
        for (const segment of segments) {
            if (segment == "." || segment == "") {
                continue
            }
            else if (segment == ".."){
                tmpCwd = tmpCwd.parent;
            }
            else if (segment in tmpCwd.children) {
                tmpCwd = tmpCwd.children[segment];
            }
            else{
                return null;
            }
        }
        return tmpCwd;
    }
}

class User{
    // User is an object that stores the user data
    constructor(name, password) {
        this.name = name;
        var publicEntry = this.getPublicEntry();
        var privateEntry = this.getPrivateEntry();

        // Validate login
        if (this.validateLogin(password, privateEntry["encType"], privateEntry["password"])){
            this.userID = publicEntry['userID'];
            this.groupID = publicEntry['groupID'];
            this.fullName = publicEntry['fullName'];
            this.homeDirectory = publicEntry['homeDirectory'];
            this.loginShell = publicEntry['loginShell'];
        }
        // Else throw error
        else{
            throw 'Error trying to login into account "' + guest + '" with password "' + password + '".';
        }
    }

    getPublicEntry() {
        var file = window.fileSystem.loadFile('/etc/passwd');
        var lines = file.split(/\r?\n/);

        for (const line of lines){
            var items = line.split(':');
            var entry = {
                'name': items[0],
                'isEncrypted': items[1] == "!",
                'userID': items[2],
                'groupID': items[3],
                'fullName': items[4],
                'homeDirectory': items[5],
                'loginShell': items[6]
            }

            if (entry['name'] == this.name){
                return entry;
            }
        }
        return null;
    }

    getPrivateEntry() {
        var file = window.fileSystem.loadFile('/etc/shadow');
        var lines = file.split(/\r?\n/);

        for (const line of lines){
            var items = line.split(':');
            var entry = {
                'name': items[0],
                'encType': items[1].split('$')[1],
                'password': items[1].split('$')[2],
                'lastChanged': items[2],
                'minCanChange': items[3],
                'maxMustChange': items[4],
                'warningDate': items[5],
                'inactiveDate': items[6],
                'expireDate': items[7]
            }

            if (entry['name'] == this.name){
                return entry;
            }
        }
        return null;
    }

    async validateLogin(password, encType, encPassword) {
        if (encType == '0'){
            return password == encPassword;
        }
        else if (encType == '1'){
            return await hashwasm.md5(password) == encPassword;
        }
        else{
            throw 'Error, encryption type "' + encType + '" not recognized by system';
        }
    }
}

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
        window.stop();
    }

    // Load user settings
    try {
        window.user = new User('guest', '1234')
    } catch (e) {
        alert(e);
        alert("Unable to login the user, stopping window.");
        window.stop();
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
        window.stop();
    }

    // Create terminal process
    try {
        window.terminal = new Terminal(this, window.fileSystem, window.user);
    } catch (e) {
        alert(e);
        alert("Unable to create terminal, stopping window.");
        window.stop();
    }

    // Create browser process

    // Load path from window URL

});
