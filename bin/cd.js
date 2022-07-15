
export function cd(path){
    var directory = window.cwd.loadPath(path);

    if (directory != null) {
        if (directory['type'] == 'dir') {
            window.cwd = directory.clone();

            window.terminal.terminal.set_prompt(window.terminal.prompt());

            return window.cwd;
        }
        else {
            throw 'cannot change cwd to a file, must be a directory.'
        }
    }
    else {
        throw 'the given path could not be found.'
    }
}
