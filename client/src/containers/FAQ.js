import React, { Component } from 'react';
import Octoicon from 'react-octicon';
import "./FAQ.css";

export default class FAQ extends Component {
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
                <h1>FAQ</h1>
                <br/> 
                <h4 className="help-questions">Q: What is the purpose of this web application?</h4> 
                <p>A: The purpose of this web application is to allow professionals to record the decisions they make as journal entries within the system.</p> 
                <br/>
                <h4 className="help-questions">Q: Why can’t I save my journal entry?</h4> 
                <p>A: Make sure you have entered text for all of the text fields: Title, Reason and Content.</p> 
                <br/>
                <h4 className="help-questions">Q: How do I ...?</h4> 
                <p>A: Please see the <a target="_blank" href="https://docs.google.com/document/d/10Ss5OLWi-5brq888rvRtgsuyTwGQYit4ka329M_16_8/edit?usp=sharing">User Manual</a> for instructions on how to use the application.</p> 
                <br/>
                <h4 className="help-questions">Q: Why can’t I permanently delete my journal entries? </h4> 
                <p>A: The journal entries are designed to be immutable once written so that a record is kept and it is unable to be tampered with.</p> 
                <br/>
                <h4 className="help-questions">Q: How do I contact you if I can’t find the answer to my question here?  </h4> 
                <p>A: If you question isn’t answered on this page, send us an email at help@rivista.com.</p> 
                <br/>
                <h4 className="help-questions">A: Why can’t I attach pictures to my journal? </h4>
                <p>A: Unfortunately, attachments are not supported in this release.</p> 
                <br/>
                <h4 className="help-questions">Q. How do I make my journal skinnable?</h4>
                <p>A. Rivista currently supports two themes: light and dark. If you wish to change to a dark theme, please check the <a target="_blank" href="https://docs.google.com/document/d/10Ss5OLWi-5brq888rvRtgsuyTwGQYit4ka329M_16_8/edit?usp=sharing">User Manual</a></p>
                <br/>
                <h4 className="help-questions">Q. Why can’t I edit an entry?</h4>
                <p>A. Please ensure that you have entered a reason for the change and a change within the text editor.</p>
            </div>
        )
    }
}