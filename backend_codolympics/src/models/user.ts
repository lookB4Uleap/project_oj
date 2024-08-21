import { model, Schema } from "mongoose";

export type UserType = {
    _id?: string;
    username: string;
    email: string;
    password: string;
    problemsSolved: number;
    badges: string[];
    points: number;
    role?: string;
    createdAt?: Date;
    updatedAt?: Date; 
}

const userSchema = new Schema<UserType>({
    username: {
        type: String,
        required: true,
        unique : true,
        dropDups: true
    },
    email: String,
    password: String,
    problemsSolved: Number,
    badges: [String],
    points: Number,
    role: String
}, {
    timestamps: true,
    collection: 'users'
});

const User = model('User', userSchema);
export default User;