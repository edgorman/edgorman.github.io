
export class Terminal{
    // Terminal is an object that stores an instantiation of the terminal CLI.
    // The bulk of processing and visuals has been implemented by JQuery Terminal.
    constructor() {
        var t = this;
        this.terminal = $("#terminal").terminal(
            {
                cat: function(path) { 
                    try{
                        this.echo(window.cat(path));
                    } catch (e) {
                        t.error(e);
                    }
                },
                cd: function(path) { 
                    try { 
                        window.cd(path);
                    } catch (e) {
                        t.error(e);
                    }
                },
                date: function() { 
                    try { 
                        this.echo(window.date()); 
                    } catch (e) {
                        t.error(e);
                    }
                },
                echo: function(...args) { 
                    try { 
                        args = args.join(" ");
                        this.echo(window.echo(args)); 
                    } catch (e) {
                        t.error(e);
                    }
                },
                help: function() { 
                    try { 
                        this.echo(window.help().join("\n"));
                    } catch (e) {
                        t.error(e);
                    }
                },
                history: function() { 
                    try { 
                        this.echo(window.history_().join("\n")); 
                    } catch (e) {
                        t.error(e);
                    }
                },
                ls: function(path) { 
                    try { 
                        var output = "";
                        var children = window.ls(path);
                        for (const [name, entry] of Object.entries(children)) {
                            // TODO: Add colouring to text
                            output += name + "\n";
                        }
                        this.echo(output); 
                    } catch (e) {
                        t.error(e);
                    }
                },
                pwd: function() {
                    try { 
                        this.echo(window.pwd()); 
                    } catch (e) {
                        t.error(e);
                    }
                },
                uname: function() {
                    try { 
                        this.echo(window.uname()); 
                    } catch (e) {
                        t.error(e);
                    }
                }
            },
            {
                name: "terminal",
                mobileDelete : true,
                checkArity : false,
                doubleTab : function(){},
                keymap : [],
                completion : function(){},
                onCommandNotFound : function(command){ t.error("could not find command '" + command + "'.")},
                prompt : t.prompt(),
                greetings : ""
            }
        )
    }

    error(message) {
        // TODO: Add colouring to text
        this.terminal.echo("[[;red;]Error: " + message + "]\n");
    }

    prompt() {
        var cwd = window.cwd.getAbsolutePath();
        var home = window.user.homeDirectory;

        if (String(cwd).startsWith(home)) {
            cwd = "~/" + cwd.substring(0, len(home));
        }

        return "[[;#7bd833;]" + window.user.name + "@" + window.uname() + "]:[[;#5b88df;]" + cwd + "]$ ";
    }
}