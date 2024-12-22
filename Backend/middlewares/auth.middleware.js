import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import blacklistTokenModel from "../models/blacklistToken.model.js"

export const authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const isBlacklisted = await blacklistTokenModel.findOne({ token: token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await UserModel.findById(decoded._id)
        req.user = user
        return next()
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized', error: error });
    }
}