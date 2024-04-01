const router = require("express").Router();
const User = require("../models/User");
const Reply = require("../models/Replies");
const Questions = require("../models/Questions");
const LocalStrategy = require("passport-local")
const passport = require("passport");


passport.use(new LocalStrategy(
    async (username,password,done)=>{

        await User.findOne({email:username,password:password})
        .then((res)=>
          done(null,res)
        )
        .catch((err)=>{
          done(null,false);
        });
        
    }
))




passport.serializeUser((user, done) => {

    done(null, user);

})

passport.deserializeUser((userObj, done) => {
    console.log("userobj", userObj);

    done(null, userObj)
})

router.get("/", (req, res, next) => {

    res.send("base_path");

});

router.get('/fail', (req, res) => {
    res.send(501);
})
// User routes ...........................
router.post('/signin', passport.authenticate('local', {
    successMessage: "Logged in Success",
    failureMessage: "Failed to login",
    failureRedirect: "/fail"
}), (req, res) => {
    
    res.status(201).json({ user: req.user}).send();
});


router.post('/signup',async(req,res)=>{
    
    const data = req.body;
    console.log(data);
    await User.create(data)
          .then((re)=>{
            console.log(re);
            res.status(201).json({ user: re})
          })
          .catch((err)=>res.status(404).send());
   
    
  });

router.put('/updateUser/:id', async (req, res) => {
    const uid = req.params.id;

    const { username, email, password } = req.body;


    await User.findByIdAndUpdate(uid, { name: username, email: email, password: password })
        .then((re) => {
            console.log(re);

            res.sendStatus(201)
        })
        .catch((err) => res.sendStatus(501));
})

router.get("/getImage/:id",async(req,res)=>{
    const uid = req.params.id;
    await User.findById(uid)
              .then(resp=>res.status(201).json({url:resp?.image}).send())
              .catch((err)=>res.sendStatus(401));
});


router.post("/setImage/:id",async(req,res)=>{
    const uid = req.params.id;
    const url = req.body.url;
    await User.findByIdAndUpdate(uid,{image:url})
              .then((re)=>{
                res.sendStatus(201);
              }).catch((err)=>{
                res.sendStatus(401);
              })
  })


// Questions routes............................



router.post('/questions', async (req, res) => {
    const question = req.body;
    console.log(question);
    await Questions.create(question).then((re) => {
        res.status(201).json({ question_id: re?._id });
    });
});

// Question to User
router.get('/questions/:questionId', async (req, res) => {
    const question = req.body;
    console.log(question);
    await Questions.findById(question).populate('replies').then((re) => {
        res.status(201).json({ questions: re });
    });
});

// Adding reply and upvote and downvotes

router.put('/questions/:questionId/replies', async (req, res) => {
    try {
        const { questionId } = req.params;
        console.log(questionId);
        const reply_bdy = req.body;

        const newReply = new Reply(reply_bdy); // Creating a reply added by a user for a particular question
        await newReply.save();


        await Questions.findByIdAndUpdate(questionId, {
            $push: { replies: newReply._id }
        });
        const repl = await Questions.findById(questionId,{"replies":1}).populate('replies');
        console.log(repl);
        res.status(200).json({ message: 'Reply added successfully',rep:repl.replies});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get USER BASED DATA

router.get("/getUserProfile/:uid",async(req,res)=>{
   
    const {uid} = req.params;
    try{
        const uprofile = await User.findById(uid);
        const allquesofUser = await Questions.find({user_id:uid}).populate('replies');

        res.status(201).json({data:{profile:uprofile,questions:allquesofUser}});
    }catch(err){
        res.sendStatus(501);
    }
})

module.exports = router;