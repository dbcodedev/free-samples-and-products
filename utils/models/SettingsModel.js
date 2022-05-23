import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    id: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    }
  });

  const SettingsModel = mongoose.model("settings", settingsSchema);

  export default SettingsModel;