
export function ls(path){
    var directory = window.cwd.loadPath(path);

    if (directory != null) {
        if (directory['type'] == 'dir') {
            return directory.children;
        }
        else {
            throw 'Error, cannot list children of a file, must be a directory.'
        }
    }
    else {
        throw 'Error, the given path could not be found.'
    }
}
