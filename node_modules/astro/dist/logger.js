import {bold, blue, red, grey, underline, yellow} from "kleur/colors";
import {Writable} from "stream";
import {format as utilFormat} from "util";
import stringWidth from "string-width";
const defaultLogDestination = new Writable({
  objectMode: true,
  write(event, _, callback) {
    let dest = process.stderr;
    if (levels[event.level] < levels["error"]) {
      dest = process.stdout;
    }
    let type = event.type;
    if (type !== null) {
      if (event.level === "info") {
        type = bold(blue(type));
      } else if (event.level === "warn") {
        type = bold(yellow(type));
      } else if (event.level === "error") {
        type = bold(red(type));
      }
      dest.write(`[${type}] `);
    }
    dest.write(utilFormat(...event.args));
    dest.write("\n");
    callback();
  }
});
const defaultLogOptions = {
  dest: defaultLogDestination,
  level: "info"
};
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts = {}, level, type, ...args) {
  var _a, _b;
  const logLevel = (_a = opts.level) != null ? _a : defaultLogOptions.level;
  const dest = (_b = opts.dest) != null ? _b : defaultLogOptions.dest;
  const event = {
    type,
    level,
    args,
    message: ""
  };
  if (levels[logLevel] > levels[level]) {
    return;
  }
  dest.write(event);
}
function debug(opts, type, ...messages) {
  return log(opts, "debug", type, ...messages);
}
function info(opts, type, ...messages) {
  return log(opts, "info", type, ...messages);
}
function warn(opts, type, ...messages) {
  return log(opts, "warn", type, ...messages);
}
function error(opts, type, ...messages) {
  return log(opts, "error", type, ...messages);
}
function table(opts, columns) {
  return function logTable(logFn, ...input) {
    const messages = columns.map((len, i) => padStr(input[i].toString(), len));
    logFn(opts, null, ...messages);
  };
}
function parseError(opts, err) {
  if (!err.frame) {
    return error(opts, "parse-error", err.message || err);
  }
  let frame = err.frame.replace(/^([0-9]+)(:)/gm, `${bold("$1")} \u2502`).replace(/(?<=^\s+)(\^)/gm, bold(red(" ^"))).replace(/^/gm, "   ");
  error(opts, "parse-error", `

 ${underline(bold(grey(`${err.filename || ""}:${err.start.line}:${err.start.column}`)))}

 ${bold(red(`\u{1D605} ${err.message}`))}

${frame}
`);
}
const logger = {
  debug: debug.bind(null, defaultLogOptions),
  info: info.bind(null, defaultLogOptions),
  warn: warn.bind(null, defaultLogOptions),
  error: error.bind(null, defaultLogOptions)
};
function padStr(str, len) {
  const strLen = stringWidth(str);
  if (strLen > len) {
    return str.substring(0, len - 3) + "...";
  }
  const spaces = Array.from({length: len - strLen}, () => " ").join("");
  return str + spaces;
}
let defaultLogLevel;
if (process.argv.includes("--verbose")) {
  defaultLogLevel = "debug";
} else if (process.argv.includes("--silent")) {
  defaultLogLevel = "silent";
} else {
  defaultLogLevel = "info";
}
export {
  debug,
  defaultLogDestination,
  defaultLogLevel,
  defaultLogOptions,
  error,
  info,
  log,
  logger,
  parseError,
  table,
  warn
};
//# sourceMappingURL=data:application/json;base64,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
