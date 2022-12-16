export default {
  userSchema: {
    uuid: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      index: {
        unique: true
      }
    },
    streamData: {
      streamTitle: String,
      streamDescription: String,
      streamCategory: String,
      streamLanguage: String,
      streamTags: [String],
      streamThumbnail: String,
    },
    streamKey: String,
    createdAt: Date,
    lastSignIn: Date,
  },
  streamSchema: {

  }
};