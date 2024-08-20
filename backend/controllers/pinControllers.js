import { Pin } from "../models/pinModel.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";

export const createPin = async (req, res) => {
  try {
    const { title, pin } = req.body;

    const file = req.file;
    const fileUrl = getDataUrl(file);

    const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

    await Pin.create({
      title,
      pin,
      image: {
        id: cloud.public_id,
        url: cloud.secure_url,
      },
      owner: req.user._id,
    });

    res.json({
      message: "Pin Created",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllPins = async (req, res) => {
  try {
    const pins = await Pin.find().sort({ createdAt: -1 });

    res.json(pins);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSinglePin = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id).populate(
      "owner",
      "-password"
    );

    res.json(pin);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const commentOnPin = async (req, res) => {
    try{
    const pin = await Pin.findById(req.params.id);
  
    if (!pin)
      return res.status(400).json({
        message: "No Pin with this id",
      });
  
    pin.comments.push({
      user: req.user._id,
      name: req.user.name,
      comment: req.body.comment,
    });
  
    await pin.save();
  
    res.json({
      message: "Comment Added",
    });
}
catch(error){
    res.status(500).json({
        message: error.message,
      });
}
  };
  
  export const deleteComment = async (req, res) => {

    try{
    const pin = await Pin.findById(req.params.id);
  
    if (!pin)
      return res.status(400).json({
        message: "No Pin with this id",
      });
  
    if (!req.query.commentId)
      return res.status(404).json({
        message: "Please give comment id",
      });
  
    const commentIndex = pin.comments.findIndex(
      (item) => item._id.toString() === req.query.commentId.toString()
    );
  
    if (commentIndex === -1) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
  
    const comment = pin.comments[commentIndex];
  
    if (comment.user.toString() === req.user._id.toString()) {
      pin.comments.splice(commentIndex, 1);
  
      await pin.save();
  
      return res.json({
        message: "Comment Deleted",
      });
    } else {
      return res.status(403).json({
        message: "You are not owner of this comment",
      });
    }
}
catch(error){
    res.status(500).json({
        message: error.message,
      });
}
  };
  
  export const deletePin = async (req, res) => {
    try{
    const pin = await Pin.findById(req.params.id);
  
    if (!pin)
      return res.status(400).json({
        message: "No Pin with this id",
      });
  
    if (pin.owner.toString() !== req.user._id.toString())
      return res.status(403).json({
        message: "Unauthorized",
      });
  
    await cloudinary.v2.uploader.destroy(pin.image.id);
  
    await pin.deleteOne();
  
    res.json({
      message: "Pin Deleted",
    });
}
catch(error){
    res.status(500).json({
        message: error.message,
      });
}
}
  
  export const updatePin = async (req, res) => {

    try{
    const pin = await Pin.findById(req.params.id);
  
    if (!pin)
      return res.status(400).json({
        message: "No Pin with this id",
      });
  
    if (pin.owner.toString() !== req.user._id.toString())
      return res.status(403).json({
        message: "Unauthorized",
      });
  
    pin.title = req.body.title;
    pin.pin = req.body.pin;
  
    await pin.save();
  
    res.json({
      message: "Pin updated",
    });

}
catch(error){
    res.status(500).json({
        message: error.message,
      });
}
  };
