import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import Octoicon from 'react-octicon';
import './Help.css';

export default class Help extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{color: this.props.theme.text}}>
                <div className="return" style={{ color: this.props.theme.text }} onClick={() => {this.props.history.goBack()}}>
                    <p className="backFont">Return</p>
                    <Octoicon mega name="arrow-left" />
                </div>
                <h1 className="title">Help</h1>
                <div className="buttons">
                    <Link to="/faq"><button type="button" className="btn btn-primary" >FAQ</button></Link> 
                    <a target="_blank" href="https://docs.google.com/document/d/10Ss5OLWi-5brq888rvRtgsuyTwGQYit4ka329M_16_8/edit?usp=sharing" ><button type="button" className="btn btn-primary" >User Manual</button></a>
                </div>
                <br/>
                <p className="contact-us">Contact us at help@rivista.com for any further questions</p>
            </div>
        )
    }
}