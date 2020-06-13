import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import logo from '../blog/Polygon.svg'
import bstyles from '../blog/blog.module.css';
import forest from './forest.jpg'
import Footer from '../blog/footer';

class chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userMode: "",
            transferInfo: { sentto: "someuser", sentby: "myuser" },
            messages: [{ source: 'S', message: 'Hi' }, { source: 'S', message: 'Hello' }, { source: 'T', message: 'what' }, { source: 'S', message: 'Doubt' }, { source: 'T', message: 'Okay' }],
            users: ["dmo", "asda", "asda"]
        }
    }

    render() {
        return (
            <div className="columns" style={{ height: '100vh' }}>
                <div className="column is-3" style={{ backgroundColor: '#36363c' }}>
                    <h1>Chat</h1>
                </div>
                <div className="column">
                    <div style={{ height: '96%', overflowY: 'scroll', padding: 10 }}>
                        {
                            this.state.messages.map( (data, index) => 
                                <div>
                                    <h1 style={data.source === 'S' ? { float: 'left', fontSize: 20 } : { float: 'right', fontSize: 20 }}> {data.message} </h1>
                                    <br/> <br/>
                                </div>
                            )
                        }
                    </div>
                    <div>
                        <div style={{ float: 'right', display: 'flex', flexDirection: 'row'}}>
                            <input className="input" style={{width: '70vw'}} type='text' placeholder="enter message" />
                            <input className="button is-dark" type="button" value='send' />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default chat;