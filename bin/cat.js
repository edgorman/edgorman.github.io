
export function cat(path){
    var file = window.cwd.loadPath(path);

    if (file != null) {
        if (file['type'] != 'dir') {
            return window.fileSystem.loadFile(file.getAbsolutePath());
        }
        else {
            throw 'cannot output a directory, must be a file.'
        }
    }
    else {
        throw 'the given path could not be found.'
    }
}
