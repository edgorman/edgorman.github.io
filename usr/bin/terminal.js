

export class Terminal{
    // Terminal is an object that stores an instantiation of the terminal CLI.
    // The bulk of processing and visuals has been implemented by JQuery Terminal.
    constructor(kernel, fileSystem, user) {
        this.kernel = kernel;
        this.fileSystem = fileSystem;
        this.user = user;
        
        this.cwd = this.kernel.cwd;

        this.terminal = $("#terminal").terminal(
            {
                echo: function(...args) { this.echo(args); }
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