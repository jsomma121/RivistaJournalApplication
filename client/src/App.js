import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
// import { Nav, Navbar, NavItem } from "react-bootstrap";
// import RouteNavItem from "./components/RouteNavItem";
import Routes from "./Routes";
import SignOutIcon from 'react-icons/lib/fa/sign-out';
import PlusIcon from 'react-icons/lib/fa/plus';
import QuestionIcon from 'react-icons/lib/fa/question';
import CogIcon from 'react-icons/lib/fa/cog';
import newJournalClicked from './containers/Home';
import moment from 'moment';
import { invokeApig, authUser, signOutUser } from "./libs/awsLib";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    var theme;
    if (localStorage.theme === undefined) {
      theme = {
        primary: "#FFF",
        background: "#F1F1F1",
        text: "#000",
        shadow: "",
        input: ""
      }
    } else {
      theme = JSON.parse(localStorage.theme);
    }

    document.body.style.backgroundColor = theme.background;

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      isLoading: true,
      currentJournal: null,
      currentEntry: null,
      currentEntryRevision: null,
      theme: theme,
      journal: []
    };

    this.searchBar;
  }


  getMenu(route) {
    if (route.includes("/editEntry") || route.includes("/login") || route.includes("/register")) {
      return null;
    } else {
      return (
        <div>
          <button type="button" className="btn btn-danger right" onClick={this.handleLogout}>Logout <SignOutIcon /></button>
          <Link to="/faq"><button type="button" className="btn btn-link"><QuestionIcon/></button></Link>
          <Link to="/settings"><button type="button" className="btn btn-link"><CogIcon/></button></Link>
        </div>
      );
    }
  }

  async componentDidMount() {
    try {
      if (await authUser()) {
        this.userHasAuthenticated(true);
        this.getJournals();
      } else {
        if (!this.props.location.pathname.includes("/login")) {
          console.log("test");
          this.props.history.push("/login");
        }
      }
    }
    catch (e) {
      console.log(e);
    }

    this.setState({ isAuthenticating: false });
  }

  async componentDidUpdate() {
    try {
      if (this.state.isLoading) {
        if (await authUser()) {
          this.getJournals();
        } else {
          if (!(this.props.location.pathname.includes("/login") || this.props.location.pathname.includes("/signup"))) {
            console.log("test");
            this.props.history.push("/login");
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  handleUpdate = state => {
    this.setState({ isLoading: state.state });
  }

  handleLogout = event => {
    signOutUser();
    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  async getJournals() {
    try {
      const getData = await invokeApig({ path: "/journal" });
      getData.sort((a, b) => {
        return moment(b.createdAt) - moment(a.createdAt);
      })
      this.setState({ journal: getData });
    } catch (e) {
      console.log(e);
    }
    this.setState({ isLoading: false });
  }

  updateTheme = theme => {
    document.body.style.backgroundColor = theme.background;
    this.setState({
      theme: theme
    })
    localStorage.theme = JSON.stringify(theme);
  }

  updateChildProps = current => {
    this.setState({
      currentEntry: current.currentEntry,
      currentJournal: current.currentJournal,
      currentEntryRevision: current.currentEntryRevision
    });
    sessionStorage.current = JSON.stringify({
      journal: current.currentJournal,
      entry: current.currentEntry,
      revision: current.currentEntryRevision
    });
    console.log(JSON.parse(sessionStorage.current));
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      isLoading: this.state.isLoading,
      handleUpdate: this.handleUpdate,
      journal: this.state.journal,
      updateChildProps: this.updateChildProps,
      currentJournal: this.state.currentJournal,
      currentEntry: this.state.currentEntry,
      currentEntryRevision: this.state.currentEntryRevision,
      isLoading: this.state.isLoading,
      sleep: this.sleep,
      theme: this.state.theme,
      updateTheme: this.updateTheme
    };
    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <nav className={"navbar fixed-top " + this.state.theme.shadow} style={{backgroundColor: this.state.theme.primary}}>
          <Link to="/" className="navbar-brand">Rivista</Link>
          {this.getMenu(this.props.location.pathname)}
        </nav>
        <Routes childProps={childProps} />
      </div>
    );
  }

}

export default withRouter(App);
