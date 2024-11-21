import mongoose from "mongoose";

export const connectdb = () => {
  mongoose
    .connect("mongodb://localhost:27017/check_payment")
    .then(() => {
      console.log("MongoDB bilan bog‘landi!");
    })
    .catch((error) => {
      console.log("Bog‘lanishda xatolik:", error);
    });
};
