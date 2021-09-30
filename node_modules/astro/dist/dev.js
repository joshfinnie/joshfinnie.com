import {green} from "kleur/colors";
import http from "http";
import path from "path";
import {performance} from "perf_hooks";
import {defaultLogDestination, defaultLogLevel, debug, error, info, parseError} from "./logger.js";
import {createRuntime} from "./runtime.js";
import {stopTimer} from "./build/util.js";
const logging = {
  level: defaultLogLevel,
  dest: defaultLogDestination
};
async function dev(astroConfig) {
  const startServerTime = performance.now();
  const {projectRoot} = astroConfig;
  const timer = {};
  timer.runtime = performance.now();
  const runtime = await createRuntime(astroConfig, {mode: "development", logging});
  debug(logging, "dev", `runtime created [${stopTimer(timer.runtime)}]`);
  const server = http.createServer(async (req, res) => {
    timer.load = performance.now();
    const result = await runtime.load(req.url);
    debug(logging, "dev", `loaded ${req.url} [${stopTimer(timer.load)}]`);
    switch (result.statusCode) {
      case 200: {
        if (result.contentType) {
          res.setHeader("Content-Type", result.contentType);
        }
        res.statusCode = 200;
        res.write(result.contents);
        res.end();
        break;
      }
      case 404: {
        const {hostname: hostname2, port: port2} = astroConfig.devOptions;
        const fullurl = new URL(req.url || "/", astroConfig.buildOptions.site || `http://${hostname2}:${port2}`);
        const reqPath = decodeURI(fullurl.pathname);
        error(logging, "access", "Not Found:", reqPath);
        res.statusCode = 404;
        const fourOhFourResult = await runtime.load("/404");
        if (fourOhFourResult.statusCode === 200) {
          if (fourOhFourResult.contentType) {
            res.setHeader("Content-Type", fourOhFourResult.contentType);
          }
          res.write(fourOhFourResult.contents);
        } else {
          res.setHeader("Content-Type", "text/plain");
          res.write("Not Found");
        }
        res.end();
        break;
      }
      case 500: {
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        switch (result.type) {
          case "parse-error": {
            const err = result.error;
            if (err.filename)
              err.filename = path.posix.relative(projectRoot.pathname, err.filename);
            parseError(logging, err);
            break;
          }
          default: {
            error(logging, "executing astro", result.error);
            break;
          }
        }
        res.statusCode = 500;
        let errorResult = await runtime.load(`/500?error=${encodeURIComponent(result.error.stack || result.error.toString())}`);
        if (errorResult.statusCode === 200) {
          if (errorResult.contentType) {
            res.setHeader("Content-Type", errorResult.contentType);
          }
          res.write(errorResult.contents);
        } else {
          res.write(result.error.toString());
        }
        res.end();
        break;
      }
    }
  });
  const {hostname, port} = astroConfig.devOptions;
  server.listen(port, hostname, () => {
    const endServerTime = performance.now();
    info(logging, "dev server", green(`Server started in ${Math.floor(endServerTime - startServerTime)}ms.`));
    info(logging, "dev server", `${green("Local:")} http://${hostname}:${port}/`);
  }).on("error", (err) => {
    if (err.code && err.code === "EADDRINUSE") {
      error(logging, "dev server", `Address ${hostname}:${port} already in use. Try changing devOptions.port in your config file`);
    } else {
      error(logging, "dev server", err.stack);
    }
    process.exit(1);
  });
}
export {
  dev as default
};
//# sourceMappingURL=data:application/json;base64,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
