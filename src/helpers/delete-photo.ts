import fs from "fs";

export const deletePhoto = (photoPath: string) => {
  fs.unlink(photoPath, (err: any) => {
    if (err) {
      console.error(`Rasmni o'chirishda xatolik yuz berdi: ${err}`);
    } else {
      console.log(`Rasm o'chirildi: ${photoPath}`);
    }
  });
};