
export class User{
    // User is an object that stores the user data
    constructor(name, password) {
        this.name = name;
        var publicEntry = this.getPublicEntry();
        var privateEntry = this.getPrivateEntry();

        // Validate login
        if (this.validateLogin(password, privateEntry["encType"], privateEntry["password"])){
            this.userID = publicEntry['userID'];
            this.groupID = publicEntry['groupID'];
            this.fullName = publicEntry['fullName'];
            this.homeDirectory = publicEntry['homeDirectory'];
            this.loginShell = publicEntry['loginShell'];
        }
        // Else throw error
        else{
            throw 'Error trying to login into account "' + guest + '" with password "' + password + '".';
        }
    }

    getPublicEntry() {
        var file = window.fileSystem.loadFile('/etc/passwd');
        var lines = file.split(/\r?\n/);

        for (const line of lines){
            var items = line.split(':');
            var entry = {
                'name': items[0],
                'isEncrypted': items[1] == "!",
                'userID': items[2],
                'groupID': items[3],
                'fullName': items[4],
                'homeDirectory': items[5],
                'loginShell': items[6]
            }

            if (entry['name'] == this.name){
                return entry;
            }
        }
        return null;
    }

    getPrivateEntry() {
        var file = window.fileSystem.loadFile('/etc/shadow');
        var lines = file.split(/\r?\n/);

        for (const line of lines){
            var items = line.split(':');
            var entry = {
                'name': items[0],
                'encType': items[1].split('$')[1],
                'password': items[1].split('$')[2],
                'lastChanged': items[2],
                'minCanChange': items[3],
                'maxMustChange': items[4],
                'warningDate': items[5],
                'inactiveDate': items[6],
                'expireDate': items[7]
            }

            if (entry['name'] == this.name){
                return entry;
            }
        }
        return null;
    }

    async validateLogin(password, encType, encPassword) {
        if (encType == '0'){
            return password == encPassword;
        }
        else if (encType == '1'){
            return await hashwasm.md5(password) == encPassword;
        }
        else{
            throw 'Error, encryption type "' + encType + '" not recognized by system';
        }
    }
}
