import jwt from "jsonwebtoken";
import * as dbServices from "../../DB/db.service.js";
import userModel from "../../DB/models/usermodel.js";
import revokeTokenModel from "../../DB/models/revokeToken.model.js";

export const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({
        message: "Token does not exist"
      });
    }

    const decoded = jwt.verify(authorization, "tata");

    //  console.log(decoded)
     
    if (!decoded?.id) {
      return res.status(401).json({
        message: "Invalid token"
      });
    }

    const user = await dbServices.findOne({
      model: userModel,
      filter: { _id: decoded.id }
    });

    if(!user){
      throw new Error ("user not found")
    }
    console.log(user)
   if (user?.changecrodentiolAt &&decoded.iat && Math.floor(user?.changecrodentiolAt?.getTime() / 1000) >decoded.iat) {
  throw new Error("Token is no longer valid");
}
if(await dbServices.findOne({model:revokeTokenModel,filter:{tokenId:decoded.jti}})){
  throw new Error("Token is expirdddd");

}
    req.user = user;
    req.decoded=decoded

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message
    });
  }
};