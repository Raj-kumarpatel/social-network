import mongoose, { model, Schema } from "mongoose";

const ChatSchmea = new Schema({
      from:{
         type:mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true
      },
      to:{
         type:mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true
      },
      message:{
        type:String,
        required:true

      },
      file:{
        path:{type:String},
        type:{type:String}
      }
      
},{timestamps:true})

const ChatModel = model('Chat',ChatSchmea)
export default ChatModel
 