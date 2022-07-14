
export function cat(path){
    var file = window.cwd.loadPath(path);

    if (file != null) {
        if (file['type'] != 'dir') {
            var data = window.fileSystem.loadFile(file.getAbsolutePath());
            console.log(data);
        }
        else {
            throw 'Error, cannot output a directory, must be a file.'
        }
    }
    else {
        throw 'Error, the given path could not be found.'
    }
}
