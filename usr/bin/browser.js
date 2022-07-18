'use strict';

const e = React.createElement;

export class Browser extends React.Component {
    // Browser is an object that represents the gui side of the website.
    // The bulk of processing and visuals has been implemented by React.
    constructor(props) {
        super(props);
    }

    render() {
        // Navbar

        // Metadata

        // Container

        // Footer

        // Return each section in a container together
        return e(
            'span',
            [],
            Date()
        )
    }
}

// Render the browser object to screen
const container = document.querySelector('#browser');
const root = ReactDOM.createRoot(container);
root.render(e(Browser));
