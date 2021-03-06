import React, { Component } from "react";
import axios from "axios";
import Navbar from './navbar';
import Footer from './footer'
import bstyles from './blog.module.css';
import renderHTML from 'react-render-html';
import ReactDisqusComments from 'react-disqus-comments';
import transformations from '../transformations.json';

class view extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uid: "",
      title: "",
      date: "",
      tag: "",
      content: "",
      image: "",
      author: "",
      userType: "",
      enrolled: [],
      isEnrolled: false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.getPosts()
    axios.get('/api/isLogged')
      .then(res => {
        this.setState({ userType: res.data.type })
        if (res.data.type === 'student') {
          this.getEnrolledList()
        }
      }).catch(err => {
        console.log(err)
      })
  }

  getPosts = () => {
    const path = this.props.location.pathname
    var cid = path.slice(6, path.lastIndexOf('/'))
    axios.get('/api/viewpost', {
      params: {
        title: path.slice(7 + cid.length).replace(/-/g, ' '),
        cid: cid
      }
    })
      .then(res => {
        if (res.data) {
          this.setState({
            uid: res.data._id,
            title: res.data.title,
            date: res.data.date,
            tag: res.data.tag,
            author: res.data.author,
            content: res.data.content,
            image: res.data.imageurl
          })
        }
        else {
          this.props.history.push('/404')
        }
      })
      .catch(err => this.props.history.push('/404'))
  }

  enrollCourse = () => {
     
   axios.get('/api/isLogged')
    .then(res => {
    }).catch(err => {
        if (err.response.status === 401) {
            this.props.history.push('/admin/login');
        }
    })
    
    if (this.state.isEnrolled) {
      window.alert("Course already enrolled")
    }
    else {
      axios.post('/api/enrollnew', {
        id: this.state.uid,
        cid: this.props.match.params.id,
        title: this.state.title,
        tag: this.state.tag,
        author: this.state.author
      })
        .then(res => {
          window.alert("Enrolled successfully!")
        })
        .catch(err => console.log(err))
    }
  }

  getEnrolledList = () => {
    const limit = 6
    axios.get('/api/enrolledtitles', {
    })
      .then(res => {
        let data = res.data.courses
        let courselist = []
        data.forEach((el) => courselist.push(el.id))
        let isEnrolled = courselist.includes(this.state.uid)
        this.setState({
          enrolled: courselist,
          isEnrolled: isEnrolled
        })
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div className={bstyles.blog} style={{ overflow: 'Hidden' }}>
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-145139004-1"></script>
        <script>{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-145139004-1');`}
        </script>
        <link href="https://fonts.googleapis.com/css?family=Noto+Sans:400,400i,700,700i&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <Navbar></Navbar>
        <div style={{ height: '100%' }}>
          <section className={`hero is-fullheight`}  >
            <h1 className={bstyles.sidebar}>U - Learn</h1>
            <div className="columns is-desktop" >
              <div className="column" >
                <img alt="header" src={`https://res.cloudinary.com/azizcloud/image/upload/${transformations.transformations.header}${(this.state.image).slice(50)}`} className={bstyles.head1} />
              </div>
              <div className="column" style={{ maxWidth: '50%' }}>
                <div className={bstyles.adapt}>
                  <h1 className={bstyles.title1}>{this.state.title}</h1>
                  <p className={bstyles.title1} style={{ fontSize: 'calc(0.3vw + 12px)', paddingTop: 30, fontWeight: 300 }}>Provided by <b> {this.state.author} </b></p>
                  {this.state.userType != 'teacher' ?
                    <div className={bstyles.title1}>
                      <button onClick={this.enrollCourse} className={bstyles.nbutton}> {this.state.isEnrolled === true ? "Enrolled" : "Enroll now"} </button>
                    </div>
                    :
                    <p></p>
                  }
                </div>
              </div>
            </div>
            <div className={`column ${bstyles.postbox} ${bstyles.slider}`}>
              <div className="container" style={{ minHeight: 400 }}>
                <div className={bstyles.contentArea} style={{ backgroundColor: "#00000000" }}>
                 
                  {this.state.isEnrolled === true | this.state.userType == 'teacher' ? renderHTML(`${this.state.content}`) :
                    <div>
                      <center> Enroll now to view this course </center>
                    </div>
                  }

                </div>
              </div>
              <br /><br /><br />
              <ReactDisqusComments
                shortname="AzizStark"
                identifier={this.state.title + this.state.cid}
                title={this.state.title}
                url={window.location.href}
                category_id={this.state.cid}
              />
            </div>
          </section>
        </div>
        <Footer></Footer>
      </div>
    );
  }
}

export default view;
