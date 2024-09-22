import mongoose, { model, Schema } from "mongoose";


export type UserType = {
    _id?: string;
    username: string;
    email: string;
    password: string;
    problemsSolved: number;
    badges: string[];
    points: number;
    roles?: {
        [key: string]: boolean
    };
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
    roles: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true,
    collection: 'users'
});

const User = model('User', userSchema);
export default User;