import mongoose, { model, Schema } from "mongoose";

const FriendSchmea = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    friend: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["requested", "accepted"],
      default: "requested",
    }
  
  },
  { timestamps: true },
);

FriendSchmea.pre("save", async function (next) {
  try {
    const count = await model("Friend").countDocuments({
      user: this.user,
      friend: this.friend,
    });
    if (count > 0) {
      throw next(new Error("friend request already sent!"));
    }
    next()
  } catch (error:any) {
       next(error);
  }
});

const FriendModel = model("Friend", FriendSchmea);

export default FriendModel;
