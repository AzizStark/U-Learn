import React, { Component } from "react";
import bstyles from './blog.module.css';
import polygon from './Polygon.svg'

class Navba extends Component {


  constructor(props) {
    super(props);
    this.state = {
      burger: "",
      userData: ""
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      userData: props.userData
    })
  }

  componentDidMount() {
    this.setState({
      userData: this.props.userData
    })
  }

  showIt = (elementId, e) => {
    e.preventDefault()
    var el = document.getElementById(elementId);
    el.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }

  toggle = () => {
    if (this.state.burger === "") {
      this.setState({ burger: "is-active" })
    }
    else {
      this.setState({ burger: "" })
    }
  }

  render() {
    return (
      <nav
        className="navbar is-dark"
        role="navigation"
        aria-label="main navigation"
        style={{ backgroundColor: "#00000000" }}
      >
        <div className="navbar-brand">
          <a className="navbar-item" href="/" >
            <img src={polygon} width="90" height="60" alt="logo" />
          </a>

          <a
            role="button"
            className={`navbar-burger burger ${this.state.burger}`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            href='# '
            onClick={this.toggle}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className={`navbar-menu ${this.state.burger}`}>
          <div className="navbar-end" style={{ fontWeight: 'bold' }} >
            <a className="navbar-item" id={bstyles.navbarItem} href="/blog">Home</a>
            <a className="navbar-item" id={bstyles.navbarItem} href="/" >About</a>
            <a className="navbar-item" id={bstyles.navbarItem} href="/contact">Contact</a>
            <a className="navbar-item" id={bstyles.navbarItem} href={this.state.userData[0] !== undefined ? "/admin/dashboard" : "/admin/login"} style={this.state.userData[0] !== undefined ? {color: "#f9c567"} : {color: "white"}} >{this.state.userData[0] !== undefined ? "Welcome "+this.state.userData[1]+", "+this.state.userData[0] : "Login"  }</a>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navba;
