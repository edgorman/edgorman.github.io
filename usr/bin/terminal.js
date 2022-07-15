
export class Terminal{
    // Terminal is an object that stores an instantiation of the terminal CLI.
    // The bulk of processing and visuals has been implemented by JQuery Terminal.
    constructor() {
        var t = this;
        this.terminal = $("#terminal").terminal(
            {
                cat: function(path) { this.echo(window.cat(path)); },
                cd: function(path) { window.cd(path); },
                date: function() { this.echo(window.date()); },
                echo: function(...args) { this.echo(window.echo(args)); },
                help: function() { this.echo(window.help().join("\n")); },
                history: function() { this.echo(window.history().join("\n")); },
                ls: function(path) { this.echo(Object.keys(window.ls(path)).join("\n")); },
                pwd: function() { this.echo(window.pwd()); },
                uname: function() { this.echo(window.uname()); }
            },
            {
                name: "terminal",
                mobileDelete : true,
                checkArity : false,
                doubleTab : function(){},
                keymap : [],
                completion : function(){},
                onCommandNotFound : function(command){},
				exceptionHandler : function(exception){},
                prompt : ">",
                greetings : ""
            }
        )
    }
}