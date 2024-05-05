const nodemailer = require("nodemailer");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const db = require("../models");
const User = db.users;

exports.register = async (req, res) => {
  console.log("req", req.body);
  try {
    const {
      name,
      email,
      password,
      phone_number,
      emergency_phone_number,
      receive_news,
      user_type,
    } = req.body;

    // Empty field validation
    const emptyFields = [];
    if (!name) emptyFields.push("name");
    if (!email) emptyFields.push("email");
    if (!password) emptyFields.push("password");
    if (!phone_number) emptyFields.push("phone number");
    if (!emergency_phone_number) emptyFields.push("emergency phone number");
    if (receive_news === null) emptyFields.push("receive news"); // Check for null specifically
    if (!user_type) emptyFields.push("user type");

    if (emptyFields.length > 0) {
      return res.status(400).json({
        message: `Please fill in the following fields: ${emptyFields.join(
          ", "
        )}`,
      });
    }

    // Phone number validation
    if (!/^\d+$/.test(phone_number) || !/^\d+$/.test(emergency_phone_number)) {
      return res
        .status(400)
        .json({ message: "Phone numbers must only contain digits" });
    }

    // Email validation
    // const emailRegex = /^(([^<>()[\\]\\\\.,;:\s@"]+(\.[^<>()[\\]\\\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // if (!emailRegex.test(email)) {
    //     return res.status(400).json({ message: 'Invalid email address' });
    // }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone_number,
      emergency_phone_number,
      receive_news,
      user_type,
    });
    // Send verification email or handle registration logic here
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

exports.me = async (req, res) => {
  try {
    const email = req?.user?.email;
    const user = await User.findOne({ where: { email } });
    res.status(200).json({ user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting session" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, rememberme } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email is not registered" });
    }

    const validPassword = await user.validPassword(password);
    if (!validPassword) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // Generate JWT token (optional)
    // Implement the generateAuthToken method in the user model if needed
    const token = await user.generateAuthToken();

    // Send user information or success message (optional)
    res.status(200).json({ message: "Login successful", token, user }); // Or send user data with token
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming user ID is passed in params
    const updates = req.body; // Updates object containing fields to modify

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    await user.update(updates);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};


exports.uploadProfileImage = async (req, res) => {
  try {
    const { userId } = req.params;

    // Use Multer middleware to handle file upload
    upload.single("image")(req, res, async (error) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Error uploading profile image" });
      }

      const image = req.file; // Access uploaded image data after successful upload
      if (!image) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.avatar = image.path; // Update avatar path in user object
      await user.save();

      res.status(200).json({ message: "Profile image uploaded successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading profile image" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate a random reset password token
    const resetToken = crypto.randomBytes(32).toString("hex"); // Generate a strong token

    // Optionally, set an expiration time for the token
    const tokenExpiration = Date.now() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Update the user object with the reset token and expiration (optional)
    user.update({ resetToken, resetTokenExpiration: tokenExpiration });

    // Send reset password email with the token (implement email sending logic)
    await sendResetPasswordEmail(email, resetToken);

    res.status(200).json({ message: "Reset password instructions sent" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error sending reset password instructions" });
  }
};

exports.sendResetPasswordEmail = async (email, resetToken) => {
  try {
    // 1. Configure Email Sending Library/Service (replace with your actual setup)
    const transporter = nodemailer.createTransport({
      host: "your-smtp-host", // Replace with your SMTP host address
      port: 587, // Replace with your SMTP port (may vary)
      secure: false, // Set to true for secure connections (TLS/SSL) if needed
      auth: {
        user: "your-email-username", // Replace with your email username
        pass: "your-email-password", // **Avoid storing password directly!** (see Security note)
      },
    });

    // 2. Prepare Email Content
    const subject = "Reset Your Password";
    const html = `
        <p>You requested a password reset for your account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="http://your-website.com/reset-password/${resetToken}">Reset Password</a>
        <p>If you did not request a password reset, please ignore this email.</p>
      `; // Customize email content and link format

    // 3. Send Email
    await transporter.sendMail({
      from: '"Your App Name" <your-email-address>', // Replace with your sender information
      to: email,
      subject: subject,
      html: html,
    });

    console.log("Reset password email sent successfully");
  } catch (error) {
    console.error("Error sending reset password email:", error);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params; // User ID from request parameters
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password (assuming password is hashed)
    const isPasswordValid = await user.comparePassword(currentPassword); // This method should exist on your User model

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    user.password = await user.hashPassword(newPassword);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error changing password" });
  }
};
