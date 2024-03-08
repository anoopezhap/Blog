const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.emailonacid.com%2Fwp-content%2Fuploads%2F2018%2F10%2FEmailAudit_Blog_2018.jpg&f=1&nofb=1&ipt=d445d1d765eb143876c476254b0e8e23438d2cce4ad30a3ad9f513f2ac0f8a1b&ipo=images",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
