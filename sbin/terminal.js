/* 
terminal.js 

@edgorman 09-10-21
*/
import { generatePromptMessage, generateGreetingMessage, generateCommitMessage, generateKeyMappings, loadFileSystem, loadGitHistory} from './utilities.js'
import { onCommandNotFound, exceptionThrown } from './errors.js';
import { help } from '../bin/help.js';


export class Terminal
{
    terminal;
    hostname = "edgorman.github.io"

    constructor(currentUser, startDirectory="/"){
        this.user = currentUser;
        this.startDirectory = startDirectory;

        this.fileSystem = loadFileSystem("etc/fileSystem.json");
        this.gitHistory = loadGitHistory("etc/gitHistory.json");
        this.commitMessage = generateCommitMessage(this.gitHistory['commits'][0]);

        this.create();
    }

    // Create terminal object
    create(){
        this.terminal = $("body").terminal({
                help : function(){ help(this); }
            }, {
                name : this.hostname + " terminal",
                mobileDelete : true,
                checkArity : false,
                keymap : generateKeyMappings(),
                onCommandNotFound : function(command){ onCommandNotFound(this, command) },
				exceptionHandler : function(exception){ exceptionThrown(this, exception); },
                prompt : generatePromptMessage(this.user.name, this.hostname, this.startDirectory),
                greetings : generateGreetingMessage(this.user.name, this.hostname, this.commitMessage)
            }
        );

        console.info("INFO: Successfully created terminal object.");
    }

}