import { OAuth2Client } from "google-auth-library";
import User from "../user/user.model.js";
import { generateToken } from "../../utils/Jwt.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import env from "../../config/env.js";
import bcrypt from "bcrypt";

const googleClient = new OAuth2Client(env.googleClientId);

export const register = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirmation } = req.body;
    if (!name || !email || !password || !passwordConfirmation) {
      throw new ApiError(400, "All fields are required");
    }
    if (password !== passwordConfirmation) {
      throw new ApiError(400, "Passwords do not match");
    }
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      throw new ApiError(409, "User already exists");
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      authProvider: "local",
    });
    await newUser.save();
    generateToken(newUser._id, res);
    new ApiResponse(
      201,
      {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        authProvider: newUser.authProvider,
      },
      "User registered successfully",
      "user",
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "All fields are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }
    generateToken(user._id, res);
    new ApiResponse(
      200,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
      },
      "Login successful",
      "user",
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { tokenId } = req.body;

    if (!tokenId) {
      throw new ApiError(400, "Token ID is required");
    }
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: env.googleClientId,
    });

    const { sub: googleId, email, name } = ticket.getPayload();
    let user = await User.findOne({ $or: [{ email }, { googleId }] });
    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
        await user.save();
      }
    } else {
      user = new User({
        name,
        email,
        googleId,
        authProvider: "google",
      });
      await user.save();
    }
    generateToken(user._id, res);
    new ApiResponse(
      200,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider,
      },
      "Google authentication successful",
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    new ApiResponse(
      200,
      {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        authProvider: req.user.authProvider,
      },
      "User data retrieved successfully",
      "user",
    ).send(res);
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    new ApiResponse(200, { message: "Logout successful" }).send(res);
  } catch (error) {
    next(error);
  }
};
