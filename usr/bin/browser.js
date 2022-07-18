
export class Browser{
    // Browser is an object that represents the gui side of the website.
    // The bulk of processing and visuals has been implemented by React.
    constructor() {
        this.container = document.querySelector('#browser');
        this.root = ReactDOM.createRoot(this.container);
        
    }
}
