import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    id: {
      type: String,
      required: true,
    },
    maxProductsByUser: {
      type: Number,
      default: 5,
    },
    maxReferenceByUser: {
      type: Number,
      default: 2,
    },
    maxProducts: {
      type: Number,
      default: 0,
    },
    displayRandomly: {
      type: Boolean,
      default: false,
    },
    hideOutOfStock: {
      type: Boolean,
      default: true,
    },
    minCartProducts: {
      type: Number,
      default: 0,
    },
    minCartAmount: {
      type: Number,
      default: 0,
    }
  });

  const SettingsModel = mongoose.model("settings", settingsSchema);

  export default SettingsModel;