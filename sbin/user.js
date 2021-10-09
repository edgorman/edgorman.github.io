/* 
user.js 

@edgorman 09-10-21
*/

class User
{
    constructor(name, password, homeDirectory){
        this.name = name;
        this.password = password;
        this.homeDirectory = homeDirectory;
    }

    // Getters and setters
    get name(){
        return this.name;
    }

    get password(){
        return this.password;
    }

    set password(value){
        this.password = value;
    }

    get homeDirectory(){
        return this.homeDirectory;
    }

    set homeDirectory(value){
        this.homeDirectory = value;
    }

    // Check whether password is valid
    is
}