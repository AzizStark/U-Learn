import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import logo from '../blog/Polygon.svg'
import bstyles from '../blog/blog.module.css';
import forest from './forest.jpg'
import Footer from '../blog/footer';

class Fileloader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: ""
        }
    }

    onFileChange = (event) => {
        this.setState({ selectedFile: event.target.files[0] });
    }

    onFileUpload = () => {

        const formData = new FormData();

        formData.append(
            "myFile",
            this.state.selectedFile,
            this.state.selectedFile.name
        );

        console.log(this.state.selectedFile);

        axios.post("api/uploadfile", formData)
            .then(res => console.log(res))

    };

    getFile = () => {
        axios.get("api/downloadfile", {})
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <div className="columns">
                <div className="column">
                    <div>
                        <input type="file" onChange={this.onFileChange} />
                        <button onClick={this.onFileUpload}>
                            Upload
                        </button>

                        <button onClick={this.getFile}>
                            Download
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Fileloader;