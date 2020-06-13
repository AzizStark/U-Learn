import express from 'express';
import Blog from '../models/Courses';
import uimage from '../models/Images';
import mailgun from 'mailgun-js';
import Susers from '../models/Susers';
import Tusers from '../models/Tusers';
import { uploader, cloudinaryConfig, v2 } from '../config/cloudinaryConfig'
import { multerUploads, dataUri } from '../middlewares/multerUpload';
import mongoose from 'mongoose';
import crypto from 'crypto';


const router = express.Router();
router.use("*", cloudinaryConfig);

const DOMAIN = process.env.MAILDOMAIN;
const mg = mailgun({ apiKey: process.env.MAILAPI, domain: DOMAIN });

//Authentication Function to secure APIs
const requireAuth = (req, res, next) => {
  if (req.session.isLogged === true) {
      next();
  } else {
      return false
  }
};

//Auth API for client routes
router.get('/isLogged', (req, res, next) => {
  if(req.session.isLogged === true){
    res.status(200).json({data: "Logged", user: req.session.user, type: req.session.userType})
  }
  else{
    res.status(401).json({data: "Error"})
  }
})



//for new user to sign up
router.post('/signup', (req, res, next) => {
  const header = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString()
  const index = header.lastIndexOf(':')
  const user = header.slice(0, index).toLowerCase()
  const pass = header.slice(index + 1)
  const email = req.body.email.toLowerCase()
  const current_date = (new Date()).valueOf().toString();
  const random = Math.random().toString();
  const pepper = crypto.createHash('sha1').update(current_date + random).digest('hex');

  const hash = crypto.pbkdf2Sync(pass, process.env.SALT + pepper, 1000, 64, 'sha256').toString('hex');

  let userdb

  if (req.body.userType == "student") {
    userdb = Susers
  }
  else {
    userdb = Tusers
  }

  userdb.findOne({
    $or: [
      { email: email },
      { userName: user }
    ]
  })
    .then(data => {
      if (data == null) {
        userdb.create({
          "userName": user,
          "email": email,
          "password": hash,
          "pepper": pepper,
          "courses": [],
          "messages": []
        })
          .then(data => {
            req.session.isLogged = true;
            req.session.user = user
            req.session.userType = req.body.userType
            res.json(data)
          })
          .catch(err => console.log(err))
      }
      else {
        res.status(309).json({
          message: "Already exists",
          email: data.email
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
})


//login to create a session
router.post('/login', (req, res, next) => {
  const header = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString()
  const index = header.lastIndexOf(':')
  const email = header.slice(0, index)
  const pass = header.slice(index + 1)
  
  let userdb;

  if (req.body.userType === "student") {
    userdb = Susers
  }
  else {
    userdb = Tusers
  }

  userdb.findOne({ $or: [{ email: email }, { userName: email }] })
    .then(data => {
      if (data !== null) {
        var hashed = crypto.pbkdf2Sync(pass, process.env.SALT + data.pepper, 1000, 64, 'sha256').toString('hex');
        if (hashed === data.password) {
          req.session.isLogged = true;
          req.session.user = data.userName
          req.session.userType = req.body.userType
          res.send("Login Successful");
          //authenticated 
        }
        else {
          res.status(401).json({ message: "Password Incorrect" })
        }
      }
      else {
        console.log(data)
        res.status(404).json({ message: "Account not found" })
      }
    })
    .catch(err => console.log(err))
})



//Logout by deleting seesion
router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy( (err) => {
      if(err) {
        return next(err);
      } else {
        return res.send(200);
      }
    });
  }
});


//Upload Image
router.post('/upload', requireAuth, multerUploads, (req, res) => {
  if (req.file) {
    const file = dataUri(req).content;
    return uploader
        .upload(file)
        .then(result => {
          const pid = result.public_id
          const image = result.secure_url
            uimage.findOneAndUpdate({},
              { $push: 
                { 
                  "images" : pid ,
                } 
              },
              {upsert: true})
              .catch( err =>
                res.status(400).json({
                  message: "Something went wrong while processing your request",
                  data: {
                    err
                  }
              }))
          return res.status(200).json({
            message: "Your image has been uploded successfully to cloudinary",
            imgurl: image,
            public_id: pid
          });
        })
        .catch(err =>
          res.status(400).json({
            message: "Something went wrong while processing your request",
            data: {
              err
            }
          })
        )
  }
});



//View single post
router.get('/viewpost', (req, res, next) => {
  //this will return all the data
  Blog.findOne({title: req.query.title, cid: req.query.cid})
    .then(data => {
      res.status(200).json(data)
      Blog.findOneAndUpdate(
        { "title" : req.query.title, "cid" : req.query.cid },
        { $inc: 
          { "vcount" : 1} 
        },
      ).then( res => {
      })
    }).catch(err =>
      res.status(400).json({
        message: "Something went wrong while processing your request",
        data: {
          err
        }
    }))
});

//Update the post
router.put('/updatepost', requireAuth, (req, res, next) => {
  if(req.body.otitle === req.body.title){
    Blog.findOneAndUpdate(
      { "title" : req.body.otitle, "cid" : req.body.cid },
      { $set: 
        { "cimages" : req.body.cimages,
          "imageurl" : req.body.imageurl,
          "title" : req.body.title,
          "tag" : req.body.tag, 
          "content" : req.body.content
        } 
      },{ returnOriginal: false }
    )
    .then(data => res.json(data))
    .catch(err =>
      res.status(400).json({
        message: "Something went wrong while processing your request",
        data: {
          err
        }
    }))
  }
  else{ //error here
    Blog.find({title: req.body.title}, "cid").sort({cid : -1}).limit(1).then((data) => {
      var cid = req.body.cid;
      if( data[0] === undefined ){
        cid = 0
      }
      else{
        cid = data[0].cid + 1
      }
        Blog.findOneAndUpdate(
          { "title" : req.body.otitle, "cid" : req.body.cid },
          { $set: 
            { "cimages" : req.body.cimages,
              "imageurl" : req.body.imageurl,
              "title" : req.body.title,
              "tag" : req.body.tag, 
              "content" : req.body.content,
              "cid": cid
            } 
          },{ returnOriginal: false }
        )
        .then(data2 => { 
           res.json(data2)})
        .catch(err =>
          res.status(400).json({
            message: "Something went wrong while processing your request",
            data: {
              err
            }
          })
        )
    })
  }
});

//Fetch all posts without content
router.get('/postitles', (req, res, next) => {
  const skip = Number(req.query.skip)
  const limit = Number(req.query.limit)

  Blog.find({},'title date imageurl cid tag vcount').skip(skip).limit(limit).sort( [['_id', -1]] )
    .then(data => res.json(data))
    .catch( err =>
      res.status(400).json({
        message: "Something went wrong while processing your request",
        data: {
          err
      }
  }))
});

//Create new post 
router.post('/posts', requireAuth, (req, res, next) => {
  Blog.countDocuments({title: (req.body.title)}).then((count) => {
      if(req.body.title){
        req.body.date = new Date().toLocaleString('en-us',{month:'long', year:'numeric', day:'numeric'})
        req.body.author = "James Bond"
        if (count == 0) {
          req.body.cid = 0
          Blog.create(req.body)
            .then(data => res.json(data))
            .catch( err => {
              res.status(400).json({
                message: "Something went wrong while processing your request",
                data: {
                  err
                }
            })
            console.log(err)})
        }
        else{
          Blog.find({title: req.body.title}, "cid").sort({cid : -1}).limit(1).then((data) => {
            req.body.cid = data[0].cid + 1
            Blog.create(req.body)
              .then(data => res.json(data))
              .catch(err => {
                res.status(400).json({
                  message: "Something went wrong while processing your request",
                  data: {
                    err
                  }
                })
              })
          }).catch(
            err => {res.status(400).json({
              message: "Something went wrong while processing your request",
              data: {
                err
              }
          })
          console.log(err)})
        }
      }else {
        res.status(400).json({
          error: "The input field is empty"
        })
      }
  })
});
  
//delete the post
router.delete('/deletepost',requireAuth, (req, res, next) => {
  Blog.findOne({"_id": req.body.id}, 'cimages')
    .then(data => 
      {
        //Delete CDN Resources associtated with the post.
        v2.api.delete_resources(data.cimages)
        .then( data => res.send(data))
        .catch( err => res.send(err))
      }
    )
    .catch(err =>
      res.status(400).json({
        message: "Something went wrong while processing your request",
        data: {
          err
        }
    }))
  Blog.findOneAndDelete({"_id": req.body.id})
    .then(data => res.json(data))
    .catch( err =>
      res.status(400).json({
        message: "Something went wrong while processing your request",
        data: {
          err
        }
    }))
})

//Mongo, Cloudinary Storage Details
router.get('/usedspace', requireAuth ,(req, res, next) => {
  mongoose.connection.db.stats({
    scale: 1024
  })
  .then(data => {
    let monspace = data
    v2.api.usage({}).then( data => {
      let clospace = data;

      const rdata = {
        "MStorage" : monspace.dataSize+monspace.indexSize,
        "CStorage" : clospace.storage.usage,
        "Credits" : clospace.credits.used_percent
       }

      res.send(rdata)
    });
  })
  .catch( err =>
    res.status(400).json({
      message: "Something went wrong while processing your request",
      data: {
        err
      }
  }))
})

//clear image from unused stack
router.delete('/deleteused',requireAuth, (req,res,next) => {
    uimage.findOneAndUpdate({},
      { $pull: 
        { 
          images : { $in: req.body.imgids}
        },
      },{ multi: true })
      .then(data => {
        res.status(200).json({
          message: "Something went wrong while processing your request",
        })
      })
      .catch( err =>
        res.status(400).json({
          message: "Something went wrong while processing your request",
          data: {
            err
          }
      }))
})

//delete Unused images from cloudinary
router.delete('/clear',requireAuth, (req,res,next) => {
    uimage.findOne({}).then(
      data => {
        v2.api.delete_resources(data.images)
        .then( data => {
          uimage.findOneAndUpdate({},
            { $set: 
              { 
                images : []
              },
            }).then( data =>{
              res.status(200).json({
                message: "Images cleared",
              })
            })
        })
        .catch( err => res.send(err))
      }
    )
    .catch( err => res.send(err))
})

router.delete('/deleteimage',requireAuth, (req,res,next) => {
      v2.api.delete_resources([req.body.imageid])
        .then( data => {
          Blog.findOneAndUpdate({ "title" : req.body.title, "cid" : req.body.cid },
            { $pull: 
              { 
                cimages : req.body.imageid,
              },
            },{ multi: true })
            .then(data => {
              res.status(200).json({
                message: "Image deleted Successfully"
              })
            })
            .catch( err => {
              res.status(400).json({
                message: "An error occured while clearing cache"
          })})
    })
})


router.post('/subscribe', (req,res,next) => {

  var list = mg.lists(`subscribers@${DOMAIN}`);

  var bob = {
    subscribed: true,
    address: req.body.mail,
  };

  list.members().create(bob, function (error, data) {
    if(data){
      res.status(200).json({ message: "Subscribed successfully"})
    }
    else{
      res.status(400).json({
        message: "Unable to subscribe"
      })
    }
  });
})


router.post('/sendmail', (req,res,next) => {

  const data = {
    from: "theazizstark@gmail.com",
    to: "thesuperaziz@gmail.com",
    subject: "Hello",
    template: "contact",
    "v:user_name": req.body.user_name,
    "v:user_email": req.body.user_email,
    "v:message": req.body.message,
  };

  mg.messages().send(data, function (error, body) {
    if(body){
      res.status(200).json({
        message: "Mail sent"
      })
    }
    else{
      res.status(400).json({
        message: "Sending failed"
      })
    }
  })

})



router.post('/sendtosubs', (req,res,next) => {

  const data = {
    from: 'theazizstark@gmail.com',
    to: 'pixivia@gmail.com',
    subject: 'Hello',
    text: 'Testing some Mailgun awesomness!'
  };
  mg.messages().send(data, function (error, body) {
    console.log(body);
  });

})

export default router;
