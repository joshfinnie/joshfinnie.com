import sharp from "sharp";
import glob from "glob";
import fs from "fs-extra";

let matches = glob.sync(`public/**/*.{png,jpg,jpeg}`);
const MAX_WIDTH = 1080;

if (process.argv.length > 2) {
  matches = [];
  process.argv.slice(2).map((f) => {
    matches = [].concat(matches, glob.sync(`public/**/${f}`));
  });
}

Promise.all(
  matches.map(async (match) => {
    const stream = sharp(match);
    const info = await stream.metadata();
    const optimizedName = match.replace(/(\..+)$/, (_, ext) => `.webp`);
    await stream.resize(MAX_WIDTH).webp().toFile(optimizedName);
  })
);
