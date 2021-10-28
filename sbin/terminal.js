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
                cat : function(path) { t.echo(commands.cat(t, path)); },
                cd : function(path) { commands.cd(t, path); },
                date : function() { t.echo(commands.date(t)); },
                debug : function() { t.echo(commands.debug(t)); },
                echo: function(...args) { t.echo(commands.echo(t, args)); },
                exit: function() { t.echo(commands.exit(t)); },
                history: function() { t.echo(commands.history(t)); },
                help : function() { t.echo(commands.help(t)); },
                ls : function(path) { t.echo(commands.ls(t, path)); },
                touch : function(path) { commands.touch(t, path); },
                pwd : function() { t.echo(commands.pwd(t)); },
                uname : function() { t.echo(commands.uname(t)); },
                whoami : function() { t.echo(commands.whoami(t)); }
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

}