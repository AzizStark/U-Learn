import React, { Component } from "react";
import axios from "axios";

class chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: "",
            recipient: [],
            messages: [],
            currentMessage: "",
            messageList: []
        }
    }

    componentDidMount() {
        axios.get('/api/isLogged')
            .then(res => {
                this.setState({ userType: res.data.type })
                this.getMessage()
                this.getMessageList()
            }).catch(err => {
                if (err.response.status === 401) {
                    this.props.history.push('/admin/login');
                }
            })
        if (this.props.location.recipientProps) {
            localStorage.setItem('recipient', this.props.location.recipientProps.recipient)
            this.setState({ recipient: this.props.location.recipientProps.recipient })
        } else {
            const reciever = localStorage.getItem('recipient');
            this.setState({ recipient: reciever })
        }
    }

    addMessage = () => {
        if (this.state.userType === 'student') {
            let msgs = this.state.messages
            msgs.push({ source: 'S', message: this.state.currentMessage })
            this.setState({
                messages: msgs,
                currentMessage: ""
            })
            this.sendMessage()
        }
        else {
            let msgs = this.state.messages
            msgs.push({ source: 'T', message: this.state.currentMessage })
            this.setState({
                messages: msgs,
                currentMessage: ""
            })
            this.sendMessage()
        }
    }

    sendMessage = () => {
        axios.put('/api/sendmessage', {
            recipient: this.state.recipient,
            messages: this.state.messages
        })
            .then(res => {
                console.log("sent")
            })
            .catch(err => console.log(err))
    }

    getMessage = () => {
        axios.get('/api/getmessage', {
            params: {
                recipient: this.state.recipient,
            }
        })
            .then(res => {
                this.setState({ messages: res.data[0].messages })
            }).catch(err => console.log(err))
    }

    getMessageList = () => {
        axios.get('/api/messagelist', {})
            .then(res => {
                this.setState({ messageList: res.data.messages })
            }).catch(err => console.log(err))
    }

    changeChat = (recipient, iddata) => {
        this.setState({ recipient: recipient }, () => this.getMessage())
        localStorage.setItem('recipient', recipient)
    }

    render() {
        return (
            <div className="columns" style={{ height: '100vh' }}>
                <div className="column is-3" style={{ backgroundColor: '#36363c' }}>
                    {this.state.messageList.map((data, index) =>
                        <a  onClick = { () => { this.changeChat(data.recipient, data.id) }} class="dropdown-item" style={{ backgroundColor: '#7092af', padding: 12, marginBottom: 2, color: '#fff', textTransform: 'capitalize'}}>
                            <h1>{data.recipient}</h1>
                        </a>
                    )}
                </div>
                <div className="column" style={{paddingLeft: 0}}>
                    <div style={{backgroundColor: '#5757df', height: '10%', display: 'flex'}}>
                        <h1 style={{ textTransform: 'capitalize', alignSelf: 'center', paddingLeft: 10, fontSize: 22}}> {this.state.recipient} - ULearn Chat </h1>
                    </div>
                    <div style={{ height: '85%', overflowY: 'scroll', padding: 10}}>
                        {
                            this.state.messages.map((data, index) =>
                                <div>
                                    <span class="tag is-success is-success" style={data.source === 'S' ? { float:  (this.state.userType === "student" ? "right" : "left"), fontSize: 20 } : { float: (this.state.userType === "student" ? "left" : "Right"), fontSize: 20 }}> {data.message}  </span>
                                    <br /> <br />
                                </div>
                            )
                        }
                    </div>
                    <div>
                        <div style={{ float: 'right', display: 'flex', flexDirection: 'row' }}>
                            <input className="input" style={{ width: '70vw' }} type='text' value={this.state.currentMessage} onChange={(e) => { this.setState({ currentMessage: e.target.value }) }} placeholder="Enter message" />
                            <input className="button is-dark" type="button" value='send' onClick={this.addMessage} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default chat;