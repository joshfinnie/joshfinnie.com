const GLOBAL = ":global(";
const CSS_SEPARATORS = new Set([" ", ",", "+", ">", "~"]);
const KEYFRAME_PERCENT = /\d+\.?\d*%/;
function minifySelector(selector) {
  return selector.replace(/(\r?\n|\s)+/g, " ").replace(/\s*(,|\+|>|~|\(|\))\s*/g, "$1");
}
function matchParen(search, start) {
  if (search[start] !== "(")
    return -1;
  let parenCount = 0;
  for (let n = start + 1; n < search.length; n++) {
    if (search[n] === ")" && parenCount === 0)
      return n;
    if (search[n] === "(")
      parenCount += 1;
    if (search[n] === ")")
      parenCount -= 1;
  }
  return -1;
}
const NEVER_SCOPED_TAGS = new Set(["base", "body", "font", "frame", "frameset", "head", "html", "link", "meta", "noframes", "noscript", "script", "style", "title"]);
function scopeRule(selector, className) {
  if (selector === "from" || selector === "to" || KEYFRAME_PERCENT.test(selector)) {
    return selector;
  }
  const input = minifySelector(selector);
  const c = className.replace(/^\.?/, ".");
  const selectors = [];
  let ss = input;
  {
    let start = 0;
    let lastValue = "";
    let parenCount = 0;
    for (let n = 0; n < ss.length; n++) {
      const isEnd = n === input.length - 1;
      if (input[n] === "(")
        parenCount += 1;
      if (input[n] === ")")
        parenCount -= 1;
      if (isEnd || parenCount === 0 && CSS_SEPARATORS.has(input[n])) {
        lastValue = input.substring(start, isEnd ? void 0 : n);
        if (!lastValue)
          continue;
        selectors.push({start, end: isEnd ? n + 1 : n, value: lastValue});
        start = n + 1;
      }
    }
  }
  for (let i = selectors.length - 1; i >= 0; i--) {
    const {start, end} = selectors[i];
    let value = selectors[i].value;
    const head = ss.substring(0, start);
    const tail = ss.substring(end);
    if (value.includes(GLOBAL)) {
      let withoutGlobal = value;
      while (withoutGlobal.includes(GLOBAL)) {
        const globalStart = withoutGlobal.indexOf(GLOBAL);
        const globalParenOpen = globalStart + GLOBAL.length - 1;
        const globalEnd = matchParen(withoutGlobal, globalParenOpen);
        const globalContents = withoutGlobal.substring(globalParenOpen + 1, globalEnd);
        withoutGlobal = withoutGlobal.substring(0, globalStart) + globalContents + withoutGlobal.substring(globalEnd + 1);
      }
      ss = head + withoutGlobal + tail;
      continue;
    }
    if (value.includes("*")) {
      ss = head + value.replace(/\*/g, c) + tail;
      continue;
    }
    if (CSS_SEPARATORS.has(value) || NEVER_SCOPED_TAGS.has(value)) {
      ss = head + value + tail;
      continue;
    }
    let pseudoclassStart = -1;
    for (let n = 0; n < value.length; n++) {
      if (value[n] === ":" && value[n - 1] !== "\\") {
        pseudoclassStart = n;
        break;
      }
    }
    if (pseudoclassStart !== -1) {
      ss = head + value.substring(0, pseudoclassStart) + c + value.substring(pseudoclassStart) + tail;
    } else {
      ss = head + value + c + tail;
    }
  }
  return ss;
}
function astroScopedStyles(options) {
  const rulesScopedCache = new WeakSet();
  return {
    postcssPlugin: "@astrojs/postcss-scoped-styles",
    Rule(rule) {
      if (!rulesScopedCache.has(rule)) {
        rule.selector = scopeRule(rule.selector, options.className);
        rulesScopedCache.add(rule);
      }
    }
  };
}
export {
  NEVER_SCOPED_TAGS,
  astroScopedStyles as default,
  scopeRule
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGVyL3RyYW5zZm9ybS9wb3N0Y3NzLXNjb3BlZC1zdHlsZXMvaW5kZXgudHMiXSwKICAibWFwcGluZ3MiOiAiQUFZQSxNQUFNLFNBQVM7QUFDZixNQUFNLGlCQUFpQixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssS0FBSyxLQUFLO0FBQ3BELE1BQU0sbUJBQW1CO0FBR3pCLHdCQUF3QixVQUEwQjtBQUNoRCxTQUFPLFNBQVMsUUFBUSxnQkFBZ0IsS0FBSyxRQUFRLDJCQUEyQjtBQUFBO0FBSWxGLG9CQUFvQixRQUFnQixPQUF1QjtBQUN6RCxNQUFJLE9BQU8sV0FBVztBQUFLLFdBQU87QUFDbEMsTUFBSSxhQUFhO0FBQ2pCLFdBQVMsSUFBSSxRQUFRLEdBQUcsSUFBSSxPQUFPLFFBQVEsS0FBSztBQUM5QyxRQUFJLE9BQU8sT0FBTyxPQUFPLGVBQWU7QUFBRyxhQUFPO0FBQ2xELFFBQUksT0FBTyxPQUFPO0FBQUssb0JBQWM7QUFDckMsUUFBSSxPQUFPLE9BQU87QUFBSyxvQkFBYztBQUFBO0FBRXZDLFNBQU87QUFBQTtBQUlGLE1BQU0sb0JBQW9CLElBQUksSUFBWSxDQUFDLFFBQVEsUUFBUSxRQUFRLFNBQVMsWUFBWSxRQUFRLFFBQVEsUUFBUSxRQUFRLFlBQVksWUFBWSxVQUFVLFNBQVM7QUFRbkssbUJBQW1CLFVBQWtCLFdBQW1CO0FBRTdELE1BQUksYUFBYSxVQUFVLGFBQWEsUUFBUSxpQkFBaUIsS0FBSyxXQUFXO0FBQy9FLFdBQU87QUFBQTtBQUlULFFBQU0sUUFBUSxlQUFlO0FBRzdCLFFBQU0sSUFBSSxVQUFVLFFBQVEsUUFBUTtBQUNwQyxRQUFNLFlBQXdCO0FBQzlCLE1BQUksS0FBSztBQUdUO0FBQ0UsUUFBSSxRQUFRO0FBQ1osUUFBSSxZQUFZO0FBQ2hCLFFBQUksYUFBYTtBQUNqQixhQUFTLElBQUksR0FBRyxJQUFJLEdBQUcsUUFBUSxLQUFLO0FBQ2xDLFlBQU0sUUFBUSxNQUFNLE1BQU0sU0FBUztBQUNuQyxVQUFJLE1BQU0sT0FBTztBQUFLLHNCQUFjO0FBQ3BDLFVBQUksTUFBTSxPQUFPO0FBQUssc0JBQWM7QUFDcEMsVUFBSSxTQUFVLGVBQWUsS0FBSyxlQUFlLElBQUksTUFBTSxLQUFNO0FBQy9ELG9CQUFZLE1BQU0sVUFBVSxPQUFPLFFBQVEsU0FBWTtBQUN2RCxZQUFJLENBQUM7QUFBVztBQUNoQixrQkFBVSxLQUFLLENBQUUsT0FBTyxLQUFLLFFBQVEsSUFBSSxJQUFJLEdBQUcsT0FBTztBQUN2RCxnQkFBUSxJQUFJO0FBQUE7QUFBQTtBQUFBO0FBTWxCLFdBQVMsSUFBSSxVQUFVLFNBQVMsR0FBRyxLQUFLLEdBQUcsS0FBSztBQUM5QyxVQUFNLENBQUUsT0FBTyxPQUFRLFVBQVU7QUFDakMsUUFBSSxRQUFRLFVBQVUsR0FBRztBQUN6QixVQUFNLE9BQU8sR0FBRyxVQUFVLEdBQUc7QUFDN0IsVUFBTSxPQUFPLEdBQUcsVUFBVTtBQUcxQixRQUFJLE1BQU0sU0FBUyxTQUFTO0FBQzFCLFVBQUksZ0JBQWdCO0FBRXBCLGFBQU8sY0FBYyxTQUFTLFNBQVM7QUFDckMsY0FBTSxjQUFjLGNBQWMsUUFBUTtBQUMxQyxjQUFNLGtCQUFrQixjQUFjLE9BQU8sU0FBUztBQUN0RCxjQUFNLFlBQVksV0FBVyxlQUFlO0FBQzVDLGNBQU0saUJBQWlCLGNBQWMsVUFBVSxrQkFBa0IsR0FBRztBQUNwRSx3QkFBZ0IsY0FBYyxVQUFVLEdBQUcsZUFBZSxpQkFBaUIsY0FBYyxVQUFVLFlBQVk7QUFBQTtBQUVqSCxXQUFLLE9BQU8sZ0JBQWdCO0FBQzVCO0FBQUE7QUFJRixRQUFJLE1BQU0sU0FBUyxNQUFNO0FBQ3ZCLFdBQUssT0FBTyxNQUFNLFFBQVEsT0FBTyxLQUFLO0FBQ3RDO0FBQUE7QUFJRixRQUFJLGVBQWUsSUFBSSxVQUFVLGtCQUFrQixJQUFJLFFBQVE7QUFDN0QsV0FBSyxPQUFPLFFBQVE7QUFDcEI7QUFBQTtBQUlGLFFBQUksbUJBQW1CO0FBQ3ZCLGFBQVMsSUFBSSxHQUFHLElBQUksTUFBTSxRQUFRLEtBQUs7QUFFckMsVUFBSSxNQUFNLE9BQU8sT0FBTyxNQUFNLElBQUksT0FBTyxNQUFNO0FBQzdDLDJCQUFtQjtBQUNuQjtBQUFBO0FBQUE7QUFHSixRQUFJLHFCQUFxQixJQUFJO0FBQzNCLFdBQUssT0FBTyxNQUFNLFVBQVUsR0FBRyxvQkFBb0IsSUFBSSxNQUFNLFVBQVUsb0JBQW9CO0FBQUEsV0FDdEY7QUFDTCxXQUFLLE9BQU8sUUFBUSxJQUFJO0FBQUE7QUFBQTtBQUk1QixTQUFPO0FBQUE7QUFJTSwyQkFBMkIsU0FBcUM7QUFDN0UsUUFBTSxtQkFBbUIsSUFBSTtBQUM3QixTQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsSUFDZixLQUFLLE1BQU07QUFDVCxVQUFJLENBQUMsaUJBQWlCLElBQUksT0FBTztBQUMvQixhQUFLLFdBQVcsVUFBVSxLQUFLLFVBQVUsUUFBUTtBQUNqRCx5QkFBaUIsSUFBSTtBQUFBO0FBQUE7QUFBQTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
