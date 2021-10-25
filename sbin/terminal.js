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
                cat : function(path) { commands.cat(t, path); t.echo(""); },
                cd : function(path) { commands.cd(t, path); t.echo(""); },
                date : function() { commands.date(t); t.echo(""); },
                debug : function() { commands.debug(t); t.echo(""); },
                echo: function(...args) { commands.echo(t, args); t.echo(""); },
                exit: function() { commands.exit(t); t.echo(""); },
                history: function() { commands.history(t); t.echo(""); },
                help : function() { commands.help(t); t.echo(""); },
                ls : function(path) { commands.ls(t, path); t.echo(""); },
                touch : function(path) { commands.touch(t, path); t.echo(""); },
                pwd : function() { commands.pwd(t); t.echo(""); },
                uname : function() { commands.uname(t); t.echo(""); },
                whoami : function() { commands.whoami(t); t.echo(""); }
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

    // Echo message through terminal object
    echo(message){
        this.terminal.echo(message);
    }

}