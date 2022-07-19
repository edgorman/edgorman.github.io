
export class User{
    // User is an object that stores the user data
    constructor(name, password) {
        this.name = name;
        var publicEntry = this.getPublicEntry();
        var privateEntry = this.getPrivateEntry();

        // Validate login
        var validate = this.validateLogin(password, privateEntry["encType"], privateEntry["password"]);

        if (validate) {
            this.userID = publicEntry['userID'];
            this.groupID = publicEntry['groupID'];
            this.fullName = publicEntry['fullName'];
            this.homeDirectory = publicEntry['homeDirectory'];
            this.loginShell = publicEntry['loginShell'];
        }
        else{
            throw 'Error, unable to login to user "' + name + '", please try again.';
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

    validateLogin(password, encType, encPassword) {
        var validate = false;

        if (encType == '0'){
            validate = password == encPassword;
        }
        else if (encType == '1'){
            validate = CryptoJS.MD5(password).toString() == encPassword;
        }
        else{
            throw 'Error, encryption type "' + encType + '" not recognized by system';
        }

        return validate;
    }
}
