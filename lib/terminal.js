/* 
terminal.js 

@edgorman 09-10-21
*/
import * as commands from '../bin/include.js';
import * as utilities from './utilities.js';


export class Terminal
{
    terminal;

    constructor(user, hostname, startDir="~"){
        this.user = user;
        this.hostname = hostname;
        this.environment = {
            "LANG": "en_UK",
            "USER": user.name,
            "PWD": user.homeDirectory,
            "HOME": user.homeDirectory,
            "SSH_CLIENT": this.hostname + " 22",
            "SHELL": "/bin/terminal.js",
            "PATH": "/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin/:/usr/local/sbin"
        }

        this.fileSystem = utilities.loadFileSystem("/etc/fileSystem.json");
        this.currentDirectory = this.fileSystem["/"];

        this.gitHistory = utilities.loadGitHistory("/etc/gitHistory.json");
        this.commitMessage = utilities.generateCommitMessage(this.gitHistory['commits'][0]);

        this.create();
        
        this.echo($("<br><span>To start, enter the command \"<span class='file-link' onclick='window.terminal.terminal.exec(\"help\");'>help</span>\" (or click the help text)</span>"));
        this.echo("");
        commands.cd(this, startDir);
    }

    // Create terminal object
    create(){
        var t = this;

        this.terminal = $("#terminal").terminal(
            {
                cat : function(path) { t.onFunctionReturnHandler(window.cat(path)); },
                cd : function(path) { t.onFunctionReturnHandler(window.cd(path)); },
                date : function() { t.onFunctionReturnHandler(window.date(t)); },
                debug : function() { t.onFunctionReturnHandler(window.debug(t)); },
                echo: function(...args) { t.onFunctionReturnHandler(window.echo(args)); },
                exit: function() { t.onFunctionReturnHandler(window.exit(t)); },
                history: function() { t.onFunctionReturnHandler(window.history_(t)); },
                help : function() { t.onFunctionReturnHandler(window.help(t)); },
                ls : function(...args) { t.onFunctionReturnHandler(window.ls(args), true); },
                pwd : function() { t.onFunctionReturnHandler(window.pwd(t)); },
                touch : function(path) { t.onFunctionReturnHandler(window.touch(path)); },
                uname : function() { t.onFunctionReturnHandler(window.uname(t)); },
                whoami : function() { t.onFunctionReturnHandler(window.whoami(t)); }
            }, 
            {
                name : "edOS",
                mobileDelete : true,
                checkArity : false,
                doubleTab : function(){},
                keymap : utilities.generateKeyMappings(),
                completion : function(){ return utilities.onCompletion(t) },
                onCommandNotFound : function(command){ utilities.onCommandNotFound(t, command) },
				exceptionHandler : function(exception){ utilities.onExceptionThrown(t, exception); },
                prompt : utilities.generatePromptMessage(t, t.currentDirectory),
                greetings : utilities.generateGreetingMessage(t)
            }
        );

        console.info("INFO: Successfully created terminal object.");
    }

    // Echo message to terminal
    echo(message){
        this.terminal.echo(message);
    }

    // Echo error to terminal
    error(message){
        this.terminal.echo("[[;red;]" + message + "]");
    }

    // Echo files to terminal
    echoFiles(file){
        switch(file['_type']){
            case 'dir':
                this.echo($("<span class='directory-link' onclick='window.cd(\"" + utilities.getFilePath(file) + "\");'>" + file["_name"] + "</span>"));
                break;
            case 'sh':
                this.echo($("<span class='executable-link' onclick='window.cat(\"" + utilities.getFilePath(file) + "\");'>" + file["_name"] + "</span>"));
                break;
            case 'js':
                this.echo($("<span class='executable-link' onclick='window.cat(\"" + utilities.getFilePath(file) + "\");'>" + file["_name"] + "</span>"));
                break;
            default:
                this.echo($("<span class='file-link' onclick='window.cat(\"" + utilities.getFilePath(file) + "\");'>" + file["_name"] + "</span>"));
                break;
        }
    }

    // On function return handler
    onFunctionReturnHandler(output, isFiles=false){
        var out = output[0];
        var err = output[1];
        var inf = output[2];

        // If there are no errors
        if (err.length == 0){
            // If output contains files
            if (isFiles){
                for (let i = 0; i < out.length; i++){
                    this.echoFiles(out[i]);
                }
            }
            // Else contains text
            else{
                for (let i = 0; i < out.length; i++){
                    this.echo(out[i]);
                }
            }
        }
        // If there are errors
        else{
            for (let i = 0; i < err.length; i++){
                this.error(err[i]);
            }
        }
    }

}