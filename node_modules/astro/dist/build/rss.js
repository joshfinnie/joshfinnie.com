var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
import parser from "fast-xml-parser";
import {canonicalURL} from "./util.js";
function validateRSS(args) {
  const {rssData, srcFile} = args;
  if (!rssData.title)
    throw new Error(`[${srcFile}] rss.title required`);
  if (!rssData.description)
    throw new Error(`[${srcFile}] rss.description required`);
  if (rssData.item)
    throw new Error(`[${srcFile}] \`item: Function\` should be \`items: Item[]\``);
  if (!Array.isArray(rssData.items))
    throw new Error(`[${srcFile}] rss.items should be an array of items`);
}
function generateRSS(args) {
  validateRSS(args);
  const {srcFile, feedURL, rssData, site} = args;
  if (rssData.item)
    throw new Error(`[${srcFile}] rss() \`item()\` function was deprecated, and is now \`items: object[]\`.`);
  let xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"`;
  if (rssData.xmlns) {
    for (const [k, v] of Object.entries(rssData.xmlns)) {
      xml += ` xmlns:${k}="${v}"`;
    }
  }
  xml += `>`;
  xml += `<channel>`;
  xml += `<title><![CDATA[${rssData.title}]]></title>`;
  xml += `<description><![CDATA[${rssData.description}]]></description>`;
  xml += `<link>${canonicalURL(feedURL, site).href}</link>`;
  if (typeof rssData.customData === "string")
    xml += rssData.customData;
  for (const result of rssData.items) {
    xml += `<item>`;
    if (typeof result !== "object")
      throw new Error(`[${srcFile}] rss.items expected an object. got: "${JSON.stringify(result)}"`);
    if (!result.title)
      throw new Error(`[${srcFile}] rss.items required "title" property is missing. got: "${JSON.stringify(result)}"`);
    if (!result.link)
      throw new Error(`[${srcFile}] rss.items required "link" property is missing. got: "${JSON.stringify(result)}"`);
    xml += `<title><![CDATA[${result.title}]]></title>`;
    xml += `<link>${canonicalURL(result.link, site).href}</link>`;
    if (result.description)
      xml += `<description><![CDATA[${result.description}]]></description>`;
    if (result.pubDate) {
      if (typeof result.pubDate === "number" || typeof result.pubDate === "string") {
        result.pubDate = new Date(result.pubDate);
      } else if (result.pubDate instanceof Date === false) {
        throw new Error("[${filename}] rss.item().pubDate must be a Date");
      }
      xml += `<pubDate>${result.pubDate.toUTCString()}</pubDate>`;
    }
    if (typeof result.customData === "string")
      xml += result.customData;
    xml += `</item>`;
  }
  xml += `</channel></rss>`;
  const isValid = parser.validate(xml);
  if (isValid !== true) {
    throw new Error(isValid);
  }
  return xml;
}
function generateRssFunction(site, routeMatch) {
  let result = {};
  function rssUtility(args) {
    if (!site) {
      throw new Error(`[${routeMatch.component}] rss() tried to generate RSS but "buildOptions.site" missing in astro.config.mjs`);
    }
    const _a = args, {dest} = _a, rssData = __objRest(_a, ["dest"]);
    const feedURL = dest || "/rss.xml";
    result.url = feedURL;
    result.xml = generateRSS({rssData, site, srcFile: routeMatch.component, feedURL});
  }
  return [rssUtility, result];
}
export {
  generateRSS,
  generateRssFunction,
  validateRSS
};
//# sourceMappingURL=data:application/json;base64,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
