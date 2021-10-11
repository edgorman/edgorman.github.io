/* 
terminal.js 

@edgorman 09-10-21
*/
import * as commands from '../bin/index.js';
import * as utilities from './utilities.js';


export class Terminal
{
    terminal;

    constructor(user, hostname){
        this.user = user;
        this.hostname = hostname;

        this.fileSystem = utilities.loadFileSystem("etc/fileSystem.json");
        this.gitHistory = utilities.loadGitHistory("etc/gitHistory.json");
        this.commitMessage = utilities.generateCommitMessage(this.gitHistory['commits'][0]);

        this.create();

        this.currentDirectory = this.fileSystem["/"];
        commands.cd(this, "~");
    }

    // Create terminal object
    create(){
        var t = this;

        this.terminal = $("body").terminal({
                cd : function(path) { commands.cd(t, path); },
                debug : function() { commands.debug(t); },
                echo: function(...args) { commands.echo(t, args); },
                help : function() { commands.help(t); },
                ls : function(path) { commands.ls(t, path); }
            }, {
                name : t.hostname + " terminal",
                mobileDelete : true,
                checkArity : false,
                doubleTab : function(){},
                keymap : utilities.generateKeyMappings(),
                completion : function(){ return utilities.onCompletion(t) },
                onCommandNotFound : function(command){ utilities.onCommandNotFound(t, command) },
				exceptionHandler : function(exception){ utilities.onExceptionThrown(t, exception); },
                prompt : utilities.generatePromptMessage(t.user.name, t.hostname, t.currentDirectory),
                greetings : utilities.generateGreetingMessage(t.user.name, t.hostname, t.commitMessage)
            }
        );

        console.info("INFO: Successfully created terminal object.");
    }

    // Echo message through terminal object
    echo(message){
        this.terminal.echo(message);
    }

}