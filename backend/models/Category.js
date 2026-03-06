const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
}
},{
    timestamps: true,
    versionKey: false,
    collection: "categories"
});

module.exports = mongoose.model("Category", categorySchema);