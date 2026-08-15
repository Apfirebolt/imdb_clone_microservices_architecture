import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    userType: {
      type: String,
      enum: ['member', 'staff'],
      required : false,
      default: 'member'
    }
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)

export default User