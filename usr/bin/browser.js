
export class Browser extends React.Component {
    // Browser is an object that represents the gui side of the website.
    // The bulk of processing and visuals has been implemented by React.
    constructor(props) {
        super(props);
    }

    render() {
        return <div id="browser"><Navbar /><Metadata /><Container /><Footer /></div>;
    }
}

export class Navbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <h1>Navbar</h1>;
    }
}

export class Metadata extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <h1>Metadata</h1>;
    }
}

export class Container extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <h1>Container</h1>;
    }
}

export class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <h1>Footer</h1>;
    }
}

// Render the browser to screen
const container = document.querySelector('.browser-container');
const root = ReactDOM.createRoot(container);
root.render(<Browser />);
