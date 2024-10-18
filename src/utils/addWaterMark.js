import Sharp from "sharp";
import { readFile } from "fs/promises";
import { resolve } from "path";

const waterMark = await readFile(resolve("./public/images/logo.png"));

export const addWaterMark = async (image) => {
  const mainImage = Sharp(image.buffer);
  const metadata = await mainImage.metadata();

  const { width, height } = metadata;

  const leftPercentage = 10;
  const topPercentage = 80;
  const watermarkSizePercentage = 30;

  const leftPosition = Math.round((leftPercentage / 100) * width);
  const topPosition = Math.round((topPercentage / 100) * height);

  const resizedWatermark = await Sharp(waterMark)
    .resize(Math.round((watermarkSizePercentage / 100) * width))
    .toBuffer();

  const waterMarkedImage = await mainImage
    .composite([
      {
        input: resizedWatermark,
        top: topPosition,
        left: leftPosition,
      },
    ])
    .png()
    .toBuffer();
  return {
    ...image,
    buffer: waterMarkedImage,
  };
};
