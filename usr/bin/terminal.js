
class Terminal{
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
                        var children = window.ls(path);
                        for (const [name, entry] of Object.entries(children)) {
                            var cmd;
                            var class_;
                            switch (entry.type) {
                                case "dir":
                                    cmd = "cd " + entry.getAbsolutePath();
                                    class_ = 'txt-directory'
                                    break;
                                default: 
                                    cmd = "cat " + entry.getAbsolutePath();
                                    class_ = "txt-command";
                                    break;
                            }

                            this.echo($(`<span class='` + class_ + `' onclick='window.terminal.terminal.exec(\"` + cmd + `\");'>` + name + `</span>`));
                        }
                        this.echo(); 
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
                completion : function() { return t.completion(); },
                onCommandNotFound : function(command){ t.error("could not find command '" + command + "'.")},
                prompt : t.prompt(),
                greetings : t.greetings()
            }
        )

        this.terminal.echo($(
            `<br><p>To start, enter the command `
            + `<span class='txt-command' onclick='window.terminal.terminal.exec(\"help\");'>\"help\"</span>`
            + ` (or click the help text)</p>`
        ));
    }

    error(message) {
        this.terminal.echo("[[;red;]Error: " + message + "]\n");
    }

    completion() {
        try{
            var value = $.terminal.parse_command(this.terminal.before_cursor()).rest;

            // If value is empty, autocomplete command
            if (value.length == 0) {
                return ["cat", "cd", "date", "echo", "help", "history", "ls", "pwd", "uname"];
            }
            // Else value is not empty, autocomplete value
            else{
                if (window.fileSystem.loadPath(value) != null) {
                    return [];
                }

                var tmpCwd = window.cwd.clone();
                
                // Get parent directory of incomplete path if it exists
                var path = value.split("/").slice(0, -1).join("/");
                var directory = tmpCwd.loadPath(path);
                if (directory != null) {
                    tmpCwd = directory.clone();
                }
                
                // Return each file in the tmp cwd as a possible completion
                var results = [];
                if (path != "") { path += "/"; }
                for (const name of Object.keys(tmpCwd.children)) {
                    results.push(path + name);
                }
                
                return results;
            }
        } catch (e){ console.log(e); }

        return [];
    }

    prompt() {
        var path = window.cwd.getAbsolutePath();
        var home = window.user.homeDirectory;
        if (String(path).startsWith(home)) {
            path = "~" + path.substring(home.length, path.length);
        }

        return "[[;#7bd833;]" + window.user.name + "@" + window.uname() + "]:[[;#5b88df;]" + path + "]$ ";
    }

    greetings() {
        return `Copyright (c) `
        + (1900 + new Date().getYear())
        + ` Edward Gorman <https://github.com/edgorman>`
        + `\nLast login: `
        + window.date();
    }
}

window.terminal = new Terminal();
