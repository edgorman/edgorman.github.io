/* 
terminal.js 

@edgorman 09-10-21
*/
import { generatePromptMessage, generateGreetingMessage, generateCommitMessage, generateKeyMappings, loadFileSystem, loadGitHistory, onCommandNotFound, onExceptionThrown} from './utilities.js'
import * as commands from '../bin/index.js';


export class Terminal
{
    terminal;

    constructor(user, hostname){
        this.user = user;
        this.hostname = hostname;

        this.fileSystem = loadFileSystem("etc/fileSystem.json");
        this.gitHistory = loadGitHistory("etc/gitHistory.json");
        this.commitMessage = generateCommitMessage(this.gitHistory['commits'][0]);

        this.create();

        this.currentDirectory = this.fileSystem["/"];
        commands.cd(this, "~");
    }

    // Create terminal object
    create(){
        var t = this;

        this.terminal = $("body").terminal({
                cd : function(path) { commands.cd(t, path); },
                help : function(){ commands.help(t); }
            }, {
                name : t.hostname + " terminal",
                mobileDelete : true,
                checkArity : false,
                keymap : generateKeyMappings(),
                onCommandNotFound : function(command){ onCommandNotFound(t, command) },
				exceptionHandler : function(exception){ onExceptionThrown(t, exception); },
                prompt : generatePromptMessage(t.user.name, t.hostname, t.currentDirectory),
                greetings : generateGreetingMessage(t.user.name, t.hostname, t.commitMessage)
            }
        );

        console.info("INFO: Successfully created terminal object.");
    }

    // Echo message through terminal object
    echo(message){
        this.terminal.echo(message);
    }

}