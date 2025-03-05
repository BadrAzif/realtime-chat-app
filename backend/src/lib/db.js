import mongoose from "mongoose";

export const connectToDb =async () => {
    try {
         await mongoose.connect(process.env.MONGO_URI);
        console.log(`server database is connected`);
    } catch (error) {
        console.log(`failed to connect to the database`);
        process.exit(1);
    }
};
