import { getFilePath } from "../lib/utilities.js";

export function pwd(terminal){
    var pwd = getFilePath(terminal.currentDirectory);

    console.log("INFO: (pwd) Displayed the working directory.");

    return [[pwd], [], []];
}