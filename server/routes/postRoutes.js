import express from "express";
import Post from "../models/Post.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
//get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    if (!posts) {
      res.status(404).json({ message: "posts not found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
});
//get one post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!post) {
      res.status(404).json({ message: "post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
});
//crete post
router.post("/", protect, async (req, res) => {
  const { title, content, image } = req.body;
  //const userId= req.user._id;
  try {
    const post = await Post.create({
      title,
      content,
      image,
      user: req.user._id,
    });

    res.status(201).json({ message: "post created", post });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
});
//update post
router.put("/:id", protect, async (req, res) => {
  const { title, content, image } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    if (req.user._id.toString() !== post.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }
    post.title = title || post.title;
    post.content = content || post.content;
    post.image = image || post.image;
    const newPost = await post.save();
    return res.status(200).json({ message: "post updated", newPost });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
});
//delete Post

router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "post not found" });
    }
    if (req.user._id.toString() !== post.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete the post" });
    }
    await post.deleteOne();
    res.status(200).json({ message: "post deleted!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
});

export default router;
