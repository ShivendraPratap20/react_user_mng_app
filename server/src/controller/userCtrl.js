const userModel = require("../db/model/userModel");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");


const verify = async (req, res) => {
  if (req.authorize) {
    res.json({ status: "SUCCESS", authorize: true, data: req.userData })
  } else
    res.json({ authorize: false })
};

const login = async (req, res) => {
  try {
    const { userID, password } = req.body;
    const result = await userModel.findOne({ userID });
    if (result == undefined) {
      res.status(404).json({ status: "FAILED", message: "User doesn't exists" });
      return;
    }
    const isMatch = await bcrypt.compare(password, result.password);
    if (!isMatch) {
      res.status(401).json({ status: "FAILED", message: "Password incorrect" });
      return;
    }
    const token = await result.generateToken();
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    res.json({ status: "SUCCESS", data: result });
  } catch (err) {
    console.log(`Error occured while signing ${err}`);
    res.status(505).json({ status: "FAILED", message: "Internal server error" });
  }
}

const signup = async (req, res) => {
  try {
    const { userID, userName, password, confirmPassword, phoneNumber } = req.body;
    const existsData = await userModel.findOne({ userID: userID });
    if (existsData != undefined) {
      res.status(409).json({ status: "FAILED", message: "User already exixts" });
      return;
    }
    const result = new userModel({
      userID,
      userName,
      password,
      confirmPassword,
      phoneNumber
    });
    const token = await result.generateToken();
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    const data = await result.save();
    res.json({ status: "SUCCESS", message: "Credentials saved. Now Login your account", data: result });
  } catch (error) {
    console.log(`Error occured while singing up ${error}`);
    res.status(505).json({ statue: "FAILED", message: "Internal server error" });
  }
}

const modify = async (req, res) => {
  try {
    const { userID, oldUserID, userName, phoneNumber } = req.body;

    if (!req.authorize) {
      return res
        .status(402)
        .json({ status: "FAILED", message: "Not authorized", authorize: false });
    }

    const user = await userModel.findOne({ userID: oldUserID });
    if (!user) {
      return res.status(404).json({ status: "FAILED", message: "User not found" });
    }

    let profilePicUrl = user.profilePic;
    if (req.file) {
      try {
        if (user.profilePic && user.profilePic.includes("cloudinary")) {
          const publicId = user.profilePic.split("/").slice(-1)[0].split(".")[0];
          await cloudinary.uploader.destroy(`profile_pics/${publicId}`);
        }

        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "profile_pics", resource_type: "image" },
            (error, uploaded) => {
              if (error) reject(error);
              else resolve(uploaded);
            }
          );
          stream.end(req.file.buffer);
        });
        profilePicUrl = result.secure_url;
      } catch (uploadErr) {
        console.log("Cloudinary upload error:", uploadErr);
        return res
          .status(500)
          .json({ status: "FAILED", message: "Error uploading profile picture" });
      }
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { userID: oldUserID },
      {
        userID,
        userName,
        phoneNumber,
        profilePic: profilePicUrl,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: "FAILED", message: "User not found" });
    }

    res.status(202).json({
      status: "SUCCESS",
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(`Error occurred while updating data: ${error}`);
    res.status(500).json({ status: "FAILED", message: "Internal server error" });
  }
};

const remove = async (req, res) => {
  try {
    const { userID } = req.params;

    if (!req.authorize) {
      res.status(402).json({ status: "FAILED", message: "Not authorized", authorize: false });
      return;
    }

    const deleted = await userModel.findOneAndDelete({ userID });

    if (!deleted) {
      return res.status(404).json({ status: "FAILED", message: "User not found" });
    }
    res.clearCookie("jwt");
    res.status(200).json({ status: "SUCCESS", message: "User deleted successfully" });
  } catch (error) {
    console.log("Error deleting user:", error);
    res.status(500).json({ status: "FAILED", message: "Internal server error" });
  }
};
const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ status: "SUCCESS", authorize: false, message: "Logout Successful" });
  } catch (error) {
    console.log(`Error occured while log out ${error}`);
    res.status(500).json({ status: "FAILED", message: "Failed" });
  }
}

module.exports = {
  verify,
  login,
  signup,
  modify,
  remove,
  logout
};