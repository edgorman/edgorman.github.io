
export function uname(){
    return window.fileSystem.loadFile('/proc/sys/kernel/hostname');
}
