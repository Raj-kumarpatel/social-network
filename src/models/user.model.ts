import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, lowercase: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    image: { type: String, default: null },
    refreshToken: { type: String},
    refreshTokenExpiry: { type: Date },
  },
  { timestamps: true }
);


UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.pre('save', function(next){
  if(this.isNew){
    this.refreshToken = null
    this.refreshTokenExpiry= null
  }
    next()
})

const UserModel = model("User", UserSchema);
export default UserModel;
