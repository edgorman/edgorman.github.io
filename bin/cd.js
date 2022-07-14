
export function cd(path){
    var directory = window.cwd.loadPath(path);

    if (directory != null) {
        if (directory['type'] == 'dir') {
            window.cwd = directory.clone();
            console.log(window.cwd.getAbsolutePath());
        }
        else {
            throw 'Error, cannot output a directory, must be a file.'
        }
    }
    else {
        throw 'Error, the given path could not be found.'
    }
}
