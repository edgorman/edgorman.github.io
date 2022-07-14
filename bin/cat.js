import { loadFile, checkPath } from '../boot/kernel.js';

export function cat(path){
    console.log(checkPath(path));
}
