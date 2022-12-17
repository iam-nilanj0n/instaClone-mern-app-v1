const router = require("express").Router();
const Post = require("../models/postModel");
const cloudinary = require('../utils/cloudinary')

// Questions to be asked 
// 1> Why it is consoling two times ?
// 2> Why cant we change the date in the reverse array ?

router.get('/PostView', async (req, res) => {
    try {
        // console.log('Get request works in react');
        const posts = await Post.find();
        // console.log(posts);
        let reversePost = [];
        let dateArr = [], dates, postDate;
        for (let i = 0; i < posts.length; i++) {
            dates = String(posts[posts.length - 1 - i].date).split(' ');
            postDate = `${dates[2]} ${dates[1]} ${dates[3]}`;
            dateArr.push(postDate)
            reversePost.push(posts[posts.length - 1 - i]);
        }
        // console.log(dateArr);
        // for(let i=0; i<reversePost.length; i++){
        //     Object.keys(reversePost[i]).forEach((item) => {
        //         console.log(String(item));
        //     })
        //     Object.values(reversePost[i]).forEach((item)=>{
        //         console.log(item)
        //     })
        //     reversePost[i]['name'] = 'Nilanjan';
        //     reversePost[i]['date'] = 'jana';
        //     console.log(reversePost[i]['date'] );
        // }
        // console.log(reversePost);
        if (posts) {
            res.status(200).send(reversePost)
        }

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong to get "
        })
    }
})

// Uploading data for instaclone project
router.post('/upload', async (req, res) => {

    const { name, location, description, PostImage } = req.body;
    try {
        // console.log('connected to Post request from react');
        if (PostImage) {
            const uploadRes = await cloudinary.uploader.upload(PostImage, {
                upload_preset: "instaClone",
            });

            if (uploadRes) {
                const post = new Post({
                    name,
                    location,
                    description,
                    PostImage: uploadRes
                })

                const savedPost = await post.save();

                res.status(200).send(savedPost)
            }
        }

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong on post"
        })
    }
})
// put request for updating likes
router.patch('/PostView/:postID', async (req, res) => {
    try {
        const postID = req.params.postID;

        const post = await Post.findByIdAndUpdate(postID, req.body)
        // console.log('after patch',post);
        res.status(200).json({
            message: "Only like is changed!",
            post: post,
        })
    } catch (error) {
        res.status(400).json({
            message: "Something went wrong on post request"
        })
    }
})

// delete request for deleting the posts and PostImage in cloudinary

router.delete('/PostView/:postID', async (req, res) => {
    try {
        const postID = req.params.postID;

        const post = await Post.findById(postID)
        const imgId = post.PostImage.public_id;

        const deleteImg = await cloudinary.uploader.destroy(imgId);
        // console.log('deleteImg', deleteImg);
        const deletePost = await Post.findByIdAndDelete(postID);
        res.status(200).json({
            message: "Post is deleted",
            post: deletePost, 
        })
    } catch (error) {
        res.status(400).json({
            message: "Something went wrong on post request"
        })
    }
})
module.exports = router;