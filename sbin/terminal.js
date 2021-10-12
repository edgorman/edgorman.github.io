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

        this.fileSystem = utilities.loadFileSystem("etc/fileSystem.json");
        this.currentDirectory = this.fileSystem["/"];

        this.gitHistory = utilities.loadGitHistory("etc/gitHistory.json");
        this.commitMessage = utilities.generateCommitMessage(this.gitHistory['commits'][0]);

        this.create();
        
        commands.cd(this, "~");
    }

    // Create terminal object
    create(){
        var t = this;

        this.terminal = $("body").terminal({
                cat : function(path) { commands.cat(t, path) },
                cd : function(path) { commands.cd(t, path); },
                date : function() { commands.date(t); },
                debug : function() { commands.debug(t); },
                echo: function(...args) { commands.echo(t, args); },
                exit: function() { commands.exit(t); },
                history: function() { commands.history(t); },
                help : function() { commands.help(t); },
                ls : function(path) { commands.ls(t, path); },
                pwd : function() { commands.pwd(t); }
            }, {
                name : t.hostname + " terminal",
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