
export class FileSystem {
    // File is an object that stores files and directories in an object focused manner.
    // The name parameter decides which entry to recursively create file objects from next,
    // And the parent paramter gives access to this file objects parent for easy file traversal.
    constructor(name = '', parent = null, data = null) {
        if (parent == null){
            var file = this.loadFile('/proc/filesystem')

            name = '/';
            parent = this;
            data = JSON.parse(file)[name];
        }

        this.name = name;
        this.parent = parent;
        this.data = data;
        this.date = data["date"];
        this.time = data["time"];
        this.type = data["type"];

        this.children = {};
        if ("children" in data){
            for(const [n, o] of Object.entries(data["children"])){
                this.children[n] = new FileSystem(n, this, o);
            }
        }
    }

    getAbsolutePath(){
        // Recurse up parent chain and add name to the path until reach root
        if (this.name == '/'){
            return "/";
        }
        else if (this.type == "dir"){
            return this.parent.getAbsolutePath() + this.name + "/";
        }
        else{
            return this.parent.getAbsolutePath() + this.name;
        }
    }

    clone(){
        // Clone a filesystem object by pass by value rather than reference
        return new FileSystem(this.name, this.parent, this.data);
    }

    loadFile(path){
        // Load a file from the current path and return the result or null if request failed.
        var file = "";
        $.ajax({
            url: path,
            cache: false,
            async: false,
            success: function(data) {
                file = data;
            }
            }).fail(function() {
                throw 'Could not load file "' + path + '" from the local file system.';
            }
        );
        return file;
    }

    loadPath(path){
        // Navigate to a given path, throwing errors if the move is not possible.
        var tmpCwd = this.clone();

        // If path is undefined, return current cwd
        if (path == undefined) {
            return tmpCwd;
        }
        path = String(path);
        
        // If path starts with root
        if (path.startsWith("/")){ 
            tmpCwd = window.fileSystem.clone();
            path = path.substring(1, path.length);
        }
    
        // If path starts with home directory
        if (path.startsWith("~")) {
            tmpCwd = window.fileSystem.clone();
            tmpCwd = tmpCwd.children['home'];
            tmpCwd = tmpCwd.children[window.user.name];
            path = path.substring(1, path.length);
        }
    
        // If path is empty or itself, return cwd
        if (path == "" || path == ".") {
            return tmpCwd;
        }
    
        // Iterate through path checking to see if jump is valid
        var segments = path.split("/");
        for (const segment of segments) {
            if (segment == "." || segment == "") {
                continue
            }
            else if (segment == ".."){
                tmpCwd = tmpCwd.parent;
            }
            else if (segment in tmpCwd.children) {
                tmpCwd = tmpCwd.children[segment];
            }
            else{
                return null;
            }
        }
        return tmpCwd;
    }
}
