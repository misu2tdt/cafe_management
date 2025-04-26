import { UserModel } from "../models/userModel";
import jwt from "jsonwebtoken";

export const authController = {
    async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await UserModel.findbyEmail(email);
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            if (user.password !== password) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}