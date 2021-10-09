/* 
terminal.js 

@edgorman 09-10-21
*/
import { help } from '../bin/help.js';


export class Terminal
{
    terminal;
    hostname = "edgorman.github.io"

    constructor(currentUser, startDirectory="/"){
        this.user = currentUser;
        this.startDirectory = startDirectory;

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
                keymap : { 'CTRL+R': function(e, original) { location.reload(); }},
                mobileDelete : true,
                checkArity : false,
                prompt : this.user.name + "@" + this.hostname + " " + "~" + "\n$ ",
                greetings : `Copyright (c) 2021 Edward Gorman` 
                            + `\n<https://github.com/edgorman>`
                            + `\n\nWelcome to https://`
                            + this.hostname
                            + `\nLast commit `
                            + `by edgorman on xxxx-xx-xx (xxxxxxx)`
                            + `\n\nYou are currently logged in as: [[b;;]` 
                            + this.user.name
                            + `]\nTo start, enter the command "[[b;;]help]"\n`
            }
        );
    }

}