const express = require('express');
const router = express.Router();
const Post = require('../Model/Post');
const User = require('../Model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const adminLayout = '../views/layout/admin';
const jwtSecret = process.env.JWT_SECRET;

/**
 * CHECK Login
 */
const authMiddleware = (req, res, next) =>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    }catch(error){
        res.status(401).json( { message:'Unauthorized' } )
    }
}



/**
 * GET/
 * Admin - Login Page
 */


router.get('/admin', async (req, res) =>{

    try{ 
        const locals ={
            title:"Admin",
            description: "Simple blog using nodejs, mongodb and ejs"
        }
        res.render('admin/index', {locals, layout: adminLayout});

    }catch(error){
        console.log('Error getting data') 
    }
});

/**
 * POST/
 * Admin - Check Login
 */

 router.post('/admin', async (req, res) =>{

    try{ 
        
        const {username, password} = req.body;

        const user = await User.findOne({username});

        if(!user){
            return res.status(401).json({message:'Invalid Credentials'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({ message: 'Invalid credentials'});
        }

        const token = jwt.sign({ userId: user._id}, jwtSecret);
        res.cookie('token', token, {httpOnly: true});

        res.redirect('/dashboard')

    }catch(error){
        console.log('Error getting data') 
    }
});

router.get('/dashboard', authMiddleware, async(req, res)=>{


    try{
        const locals = {
            title:'Dashboard',
            description:'Simple Blog created with NodeJs, Express & MongoDB'
            
        }
        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        });

    } catch(error){
        console.log(error);
    }
});


/**
 * GET/
 * Admin - Create New Post
 */
 router.get('/add-post', authMiddleware, async(req, res)=>{


    try{
        const locals = {
            title:'Add Post',
            description:'Simple Blog created with NodeJs, Express & MongoDB'
            
        }
        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        });

    } catch(error){
        console.log(error);
    }
});


/**
 * GET/
 * Admin - Update
 */
 router.get('/edit-post/:id', authMiddleware, async(req, res)=>{


    try{

        
        const data = await Post.findOne({_id: req.params.id})

        const locals = {
            title:'Edit Post',
            description:'Simple Blog created with NodeJs, Express & MongoDB'
            
        }


        res.render('admin/edit-post',{
            data,
            locals,
            layout: adminLayout
        });

    } catch(error){
        console.log(error);
    }
});






/**
 * PUT/
 * Admin - Update
 */
 router.put('/edit-post/:id', authMiddleware, async(req, res)=>{


    try{

        await Post.findByIdAndUpdate(req.params.id, {
            title:req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        }); 

        res.redirect(`/edit-post/${req.params.id}`)

    } catch(error){
        console.log(error);
    }
});


/**
 * POST/
 * Admin - Create New Post
 */
 router.post('/add-post', authMiddleware, async(req, res)=>{

    try{

        console.log(req.body);

        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            });

            await Post.create(newPost);
            
        } catch (error) {
            console.log(error)
        }
        res.redirect('/dashboard');


    } catch(error){
        console.log(error);
    }
});





//  router.post('/admin', async (req, res) =>{

//     try{ 
        
//         const {username, password} = req.body;

//         if(req.body.username === 'admin' && req.body.password === 'password')
//         {
//             res.send('You are logged in.')
//         }
//         else{
//             res.send('Wrong username or password');
//         }


//         console.log(req.body);
//         res.redirect('/admin');

//         // res.render('admin/index', {locals, layout: adminLayout});

//     }catch(error){
//         console.log('Error getting data') 
//     }
// });

/**
 * POST/
 * Admin - Register
 */

router.post('/register', async (req, res) =>{

    try{

        const {username, password} = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        try{
            const user = await User.create({ username, password: hashPassword});
            res.status(201).json({
                message: 'User Created', user
            });
        }catch(error){
            if(error.code == 11000){
                res.status(409).json({message: 'User already in use'});
            }
            res.status(500).json({message:'Internal server error'});
        }

    }catch(error){
        console.log(error);
    }
});


/**
 * Delete/
 * Admin - Admin Delete Post
 */
 router.delete('/delete-post/:id', authMiddleware, async(req, res)=>{


    try{

        await Post.deleteOne({_id: req.params.id});
        res.redirect('/dashboard');

    } catch(error){
        console.log(error);
    }
});

/**
 * GET/
 * Admin - Admin Logout
 */

router.get('/logout', (req, res)=>{
    res.clearCookie('token');
    // res.json({ message:'Logout successfull'});
    res.redirect('/');
});







module.exports = router;