import jwt from 'jsonwebtoken';
import { promisify } from 'util';
const sign = promisify(jwt.sign);
export const generateTokens = async (userId, res) => {
    try {
        if (!userId || !res) throw new Error('userId or res is not defined');
        if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
        const token = await sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: process.env.NODE_ENV !== 'development' ? 'strict' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        })
        return token
    }
    catch (error) {
        console.error('error in generateTokens', error)
        throw new Error(error.message);
    }
}