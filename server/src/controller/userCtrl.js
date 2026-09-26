const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const { OAuth2Client } = require("google-auth-library");
const userModel = require("../db/model/userModel");
const sessionModel = require("../db/model/sessionModel");
const { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } = require("../util/authUtils");
const { BASE_URL, GOOGLE_AUTH_URL, GOOGLE_REDIRECT_URL, GOOGLE_TOKEN_URL } = require('../const')

const SECURE = process.env.NODE_ENVIRONMENT == 'PROD' ? true : false;
const SAME_SITE = process.env.NODE_ENVIRONMENT == 'PROD' ? "none" : "lax"

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
    //const token = await result.generateToken();

    const tokenData = new sessionModel({
      userID
    });

    const { accessToken, refreshToken } = await tokenData.generateToken();
    if (accessToken && refreshToken)
      await tokenData.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: SECURE,
      sameSite: SAME_SITE,
      maxAge: ACCESS_TOKEN_EXPIRY,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: SECURE,
      sameSite: SAME_SITE,
      maxAge: REFRESH_TOKEN_EXPIRY,
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
    //const token = await result.generateToken();    Old token generation method

    const tokenData = new sessionModel({
      userID
    });

    const { accessToken, refreshToken } = await tokenData.generateToken();
    if (accessToken && refreshToken)
      await tokenData.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: SECURE,
      sameSite: SAME_SITE,
      maxAge: ACCESS_TOKEN_EXPIRY,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: SECURE,
      sameSite: SAME_SITE,
      maxAge: REFRESH_TOKEN_EXPIRY,
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
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: SECURE,
      sameSite: SAME_SITE,
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: SECURE,
      sameSite: SAME_SITE,
    });
    res.status(200).json({ status: "SUCCESS", message: "User deleted successfully" });
  } catch (error) {
    console.log("Error deleting user:", error);
    res.status(500).json({ status: "FAILED", message: "Internal server error" });
  }
};
const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: SECURE,
      sameSite: SAME_SITE,
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: SECURE,
      sameSite: SAME_SITE,
    });
    res.status(200).json({ status: "SUCCESS", authorize: false, message: "Logout Successful" });
  } catch (error) {
    console.log(`Error occured while log out ${error}`);
    res.status(500).json({ status: "FAILED", message: "Failed" });
  }
}

const googleLoginHandler = async (req, res) => {
  try {
    console.log('Google request made');
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URL,
      response_type: 'code',
      scope: 'openid email profile',
      state: process.env.GOOGLE_STATE,
    });

    res.redirect(`${GOOGLE_AUTH_URL}?${params}`);
  } catch (error) {
    console.log(`Error while login in with google ${error}`)
  }
};

const googleCallbackHandler = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (state != process.env.GOOGLE_STATE)
      return res.status(403).send({
        status: "FAILED",
        message: "Google state mismatch"
      })

    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URL,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      return res.status(400).send('Token exchange failed')
    }

    const tokens = await tokenResponse.json();
    // tokens = { access_token, id_token, expires_in, scope, token_type, refresh_token? }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).send({status: "FAILED", message: "Email not verified by google"});
    }

    let user = await userModel.findOne({ userID: email });
    if (!user) {
      const result = new userModel({
        userName: name,
        userID: email,
      });
      user = await result.save();
    }

    const tokenData = new sessionModel({
      userID: email
    });

    const { accessToken, refreshToken } = await tokenData.generateToken();
    if (accessToken && refreshToken)
      await tokenData.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: SECURE,
      sameSite: SAME_SITE,
      maxAge: ACCESS_TOKEN_EXPIRY,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: SECURE,
      sameSite: SAME_SITE,
      maxAge: REFRESH_TOKEN_EXPIRY,
    });
    //res.json({ status: "SUCCESS", message: "Credentials saved. Now Login your account", data: user });
    res.redirect("http://localhost:5173/");
  } catch (error) {
    console.log(`Error occured while handling google callback ${error}`)
    res.status(500).send(JSON.stringify({ status: false, message: `${error}` }));

  }
};

module.exports = {
  verify,
  login,
  signup,
  modify,
  remove,
  logout,
  googleLoginHandler,
  googleCallbackHandler
};