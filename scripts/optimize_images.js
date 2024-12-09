import sharp from "sharp";
import { globSync } from "glob";

let matches = globSync(`public/**/*.{png,jpg,jpeg}`);
const MAX_WIDTH = 1080;

if (process.argv.length > 2) {
  matches = [];
  process.argv.slice(2).map((f) => {
    matches = [].concat(matches, globSync(`public/**/${f}`));
  });
}

Promise.all(
  matches.map(async (match) => {
    const stream = sharp(match);
    const optimizedName = match.replace(/(\..+)$/, () => `.webp`);
    await stream.resize(MAX_WIDTH).webp().toFile(optimizedName);
  })
);
