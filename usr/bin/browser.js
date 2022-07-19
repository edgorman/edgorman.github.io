
const e = React.createElement;

export class Browser extends React.Component {
    // Browser is an object that represents the gui side of the website.
    // The bulk of processing and visuals has been implemented by React.
    constructor(props) {
        super(props);
    }

    render() {
        const navbar = e('div', {id: "navbar"}, "navbar");
        const metadata = e('div', {id: "metadata"}, "metadata");
        const container = e('div', {id: "container"}, "container");
        const footer = e('div', {id: "footer"}, "footer");

        return e('div', {}, [
                navbar,
                metadata,
                container,
                footer
            ]
        );
    }
}

// Render the browser object to screen
const container = document.querySelector('#browser');
const root = ReactDOM.createRoot(container);
root.render(e(Browser));
