import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describes the properties
// that are required to create a new User

interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        // ret is the object that is going to be turned into JSON
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// Use function keyword rather than arrow function because mongoose is old school and stupid
userSchema.pre("save", async function (done) {
  // isModified returns true on the initial build and when password is changed
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// the '<>' generic syntax is used to tell typescript what the type of function is
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Testing the entry creation functionality
// const user = User.build({
//   email: "test@test.com",
//   password: "password",
// });

export { User, buildUser };
