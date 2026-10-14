import jwt from "jsonwebtoken";
import * as dbServices from "../../DB/db.service.js";
import userModel from "../../DB/models/usermodel.js";

export const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({
        message: "Token does not exist"
      });
    }

    const decoded = jwt.verify(authorization, "tata");

    if (!decoded?.id) {
      return res.status(401).json({
        message: "Invalid token"
      });
    }

    const user = await dbServices.findOne({
      model: userModel,
      filter: { _id: decoded.id }
    });

    if (!user) {
      return res.status(404).json({
        message: "User does not exist"
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message
    });
  }
};