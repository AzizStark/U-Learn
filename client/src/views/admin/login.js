import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faChalkboardTeacher, faGraduationCap } from '@fortawesome/free-solid-svg-icons'
import logo from '../ulearn/Polygon.svg'
import bstyles from '../ulearn/blog.module.css';
import Footer from '../ulearn/footer';

class login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logindata: {
                "user_email": "",
                "user_password": "",
                "user_type": "student"
            },
            userMode: ["is-active", ""]
        }
    }

    updateForm = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        let data = this.state.logindata;
        data[nam] = val
        this.setState({ logindata: data });
    }

    login = (event) => {
        event.preventDefault()
        axios.post("/api/login", {userType: this.state.logindata['user_type']},
        {
            auth: {
                username: this.state.logindata['user_email'],
                password: this.state.logindata['user_password']
            }
        })
        .then(res => {
            if (res.data) {
                this.props.history.push('/');
            }
        })
        .catch(err => {
            if (err.response.status === 404) {
                window.alert("Account not found")
            }
            else if (err.response.status === 401) {
                window.alert("Incorrect password")
            }
        });
    }


    changeType = (type) => {
        let data = this.state.logindata;
        if (type === 'S') {
            data["user_type"] = "student"
            this.setState({ userMode: ["is-active", ""] })
        }
        else {
            data["user_type"] = "teacher"
            this.setState({ userMode: ["", "is-active"] })
        }
    }

    render() {
        return (
            <div className="columns">
                <div className="column">
                    <img alt="header" className={bstyles.sideimg} style={{ width: '50%', height: '100vh', position: 'fixed', objectFit: 'cover' }} src="https://images.unsplash.com/photo-1585314540452-982cb5936d71?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80" />
                    <img src={logo} alt="logo" style={{ width: 80, margin: 20, zIndex: 99, position: 'fixed' }} />
                </div>
                <div className="column" >
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: 0, minHeight: '100vh' }} >
                        <form className={bstyles.holder} onSubmit={this.login}>
                        <div className="tabs is-toggle is-fullwidth">
                            <ul>
                                <li className={this.state.userMode[0]} onClick = {() => this.changeType('S')}>
                                <a>
                                    <FontAwesomeIcon icon={faGraduationCap} size="1x" />&nbsp;&nbsp;
                                    <span>Student</span>
                                </a>
                                </li>
                                <li className={this.state.userMode[1]} onClick = {() => this.changeType('T')}>
                                <a>
                                    <FontAwesomeIcon icon={faChalkboardTeacher} size="1x" />&nbsp;&nbsp;
                                    <span>Teacher</span>
                                </a>
                                </li>
                            </ul>
                            </div>

                            <h1 className='title' style={{ fontSize: 50, color: 'white', textAlign: 'center', fontWeight: 700, letterSpacing: '0.1em' }} > Login </h1> <br />
                            <p className="control has-icons-left">
                                <input onChange={this.updateForm} name="user_email" style={{ textTransform: 'lowercase' }} className={bstyles.inputarea} type="text" placeholder="Username" required />
                                <span className="icon is-small is-left">
                                    <FontAwesomeIcon icon={faEnvelope} size="1x" />
                                </span>
                            </p><br /><br />
                            <p className="control has-icons-left">
                                <input onChange={this.updateForm} name="user_password"  className={bstyles.inputarea} type="password" placeholder="Password" required />
                                <span className="icon is-small is-left">
                                    <FontAwesomeIcon icon={faLock} size="1x" />
                                </span>
                            </p>
                            <br /><br />
                            <center>
                                <button className={bstyles.nbutton} value="submit"> Login </button>
                                <br />
                                <br />
                                <a href="/admin/signup"> or Signup</a>
                            </center>
                        </form>
                    </div>
                    <Footer></Footer>
                </div>
            </div>
        )
    }
}

export default login;