
import mongoose, { model, Schema } from "mongoose";


const PostSchmea = new Schema({
    user: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
    attachment:{
        type:String,
        default:null
    },
    type:{
        type:String,
        default:null
    },
    content:{
        type:String,
        required:true
    }
},{timestamps:true})

const PostModel = model("Post",PostSchmea)
export default PostModel