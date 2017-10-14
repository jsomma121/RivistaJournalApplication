import React, { Component } from 'react';

export default class Settings extends Component {
    constructor(props) {
        super(props);
    }

    handleLightTheme() {
        var theme = {
            primary: "#FFF",
            background: "#F1F1F1",
            text: "#000",
            shadow: "",
            input: "",
            editor: ""
        }
        this.props.updateTheme(theme);
    }

    handleDarkTheme() {
        var theme = {
            primary: "#36393E",
            background: "#1E2124",
            text: "#FFF",
            shadow: "dark-shadow",
            input: "dark-input",
            editor: "dark-editor"
        }
        this.props.updateTheme(theme);
    }

    render() {
        return (
            <div style={{color: this.props.theme.text}}>
                <h1>Change Theme</h1>
                <button type="button" className="btn btn-primary" onClick={() => this.handleLightTheme()}>Light theme</button>
                <button type="button" className="btn btn-primary" onClick={() => this.handleDarkTheme()}>Dark theme</button>
            </div>
        )
    }
}