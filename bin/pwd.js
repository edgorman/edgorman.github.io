import { getFilePath } from "../sbin/utilities.js";

export function pwd(terminal){
    console.log("INFO: (pwd) Displayed the working directory.");

    return [getFilePath(terminal.currentDirectory)];
}