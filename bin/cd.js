
export function cd(path){
    var directory = window.cwd.loadPath(path);

    if (directory != null) {
        if (directory['type'] == 'dir') {
            window.cwd = directory.clone();
            return window.cwd;
        }
        else {
            throw 'Error, cannot change cwd to a file, must be a directory.'
        }
    }
    else {
        throw 'Error, the given path could not be found.'
    }
}
