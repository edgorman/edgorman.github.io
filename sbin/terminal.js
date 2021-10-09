/* 
terminal.js 

@edgorman 09-10-21
*/
import { greetingMessage, promptMessage, generateKeyMappings} from './utilities.js'
import { onCommandNotFound, exceptionThrown } from './errors.js';
import { help } from '../bin/help.js';


export class Terminal
{
    terminal;
    hostname = "edgorman.github.io"

    constructor(currentUser, startDirectory="/"){
        this.user = currentUser;
        this.startDirectory = startDirectory;
        this.commitMessage = `by edgorman on xxxx-xx-xx (xxxxxxx)`

        this.onLoad();
    }

    // Execute on window load
    onLoad(){
        this.create();
    }

    // Execute on window exit
    onExit(){

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
                prompt : promptMessage(this.user.name, this.hostname, this.startDirectory),
                greetings : greetingMessage(this.user.name, this.hostname, this.commitMessage)
            }
        );
    }

}