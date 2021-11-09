/* 
terminal.js 

@edgorman 09-10-21
*/
import * as commands from '../bin/include.js';
import * as utilities from './utilities.js';


export class Terminal
{
    terminal;

    constructor(user, hostname){
        this.user = user;
        this.hostname = hostname;

        this.fileSystem = utilities.loadFileSystem("../etc/fileSystem.json");
        this.currentDirectory = this.fileSystem["/"];

        this.gitHistory = utilities.loadGitHistory("../etc/gitHistory.json");
        this.commitMessage = utilities.generateCommitMessage(this.gitHistory['commits'][0]);

        this.create();
        
        this.echo($("<br><span>To start, enter the command \"<span class='file-link' onclick='window.terminal.terminal.exec(\"help\");'>help</span>\" (or click the help text)</span>"));
        this.echo("");
        commands.cd(this, "~");
    }

    // Create terminal object
    create(){
        var t = this;

        this.terminal = $("#terminal").terminal(
            {
                cat : function(path) { t.onFunctionReturnHandler(commands.cat(t, path)); },
                cd : function(path) { t.onFunctionReturnHandler(commands.cd(t, path)); },
                date : function() { t.onFunctionReturnHandler(commands.date(t)); },
                debug : function() { t.onFunctionReturnHandler(commands.debug(t)); },
                echo: function(...args) { t.onFunctionReturnHandler(commands.echo(t, args)); },
                exit: function() { t.onFunctionReturnHandler(commands.exit(t)); },
                history: function() { t.onFunctionReturnHandler(commands.history(t)); },
                help : function() { t.onFunctionReturnHandler(commands.help(t)); },
                ls : function(path) { t.onFunctionReturnHandler(commands.ls(t, path), true); },
                pwd : function() { t.onFunctionReturnHandler(commands.pwd(t)); },
                touch : function(path) { t.onFunctionReturnHandler(commands.touch(t, path)); },
                uname : function() { t.onFunctionReturnHandler(commands.uname(t)); },
                whoami : function() { t.onFunctionReturnHandler(commands.whoami(t)); }
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
    echo(messageList){
        for (const message of messageList){
            this.terminal.echo(message);
        }
    }

    // Echo error to terminal
    error(errorMessage){
        this.terminal.echo("[[;red;]" + errorMessage + "]");
    }

    // Echo files to terminal
    echoFiles(file){
        switch(file['_type']){
            case 'dir':
                this.echo($("<span class='directory-link' onclick='window.cd(\"" + file["_name"] + "\");'>" + file["_name"] + "</span>"));
                break;
            case 'sh':
                this.echo($("<span class='executable-link' onclick='window.cat(\"" + file["_name"] + "\");'>" + file["_name"] + "</span>"));
                break;
            case 'js':
                this.echo($("<span class='executable-link' onclick='window.cat(\"" + file["_name"] + "\");'>" + file["_name"] + "</span>"));
                break;
            default:
                this.echo($("<span class='file-link' onclick='window.cat(\"" + file["_name"] + "\");'>" + file["_name"] + "</span>"));
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
                for (const msg in out){
                    this.echo(msg);
                }
            }
        }
        // If there are errors
        else{
            for (const msg in err){
                this.error(msg);
            }
        }
    }

}