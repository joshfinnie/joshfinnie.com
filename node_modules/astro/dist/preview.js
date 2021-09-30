import http from "http";
import {green} from "kleur/colors";
import {performance} from "perf_hooks";
import send from "send";
import {fileURLToPath} from "url";
import {defaultLogDestination, defaultLogLevel, error, info} from "./logger.js";
const logging = {
  level: defaultLogLevel,
  dest: defaultLogDestination
};
async function preview(astroConfig) {
  const startServerTime = performance.now();
  const {hostname, port} = astroConfig.devOptions;
  const server = http.createServer((req, res) => {
    send(req, req.url, {root: fileURLToPath(astroConfig.dist)}).pipe(res);
  });
  return server.listen(port, hostname, () => {
    const endServerTime = performance.now();
    info(logging, "preview", green(`Preview server started in ${Math.floor(endServerTime - startServerTime)}ms.`));
    info(logging, "preview", `${green("Local:")} http://${hostname}:${port}/`);
  }).on("error", (err) => {
    if (err.code && err.code === "EADDRINUSE") {
      error(logging, "preview", `Address ${hostname}:${port} already in use. Try changing devOptions.port in your config file`);
    } else {
      error(logging, "preview", err.stack);
    }
    process.exit(1);
  });
}
export {
  preview
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3ByZXZpZXcudHMiXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFFQSxNQUFNLFVBQXNCO0FBQUEsRUFDMUIsT0FBTztBQUFBLEVBQ1AsTUFBTTtBQUFBO0FBSVIsdUJBQThCLGFBQTBCO0FBQ3RELFFBQU0sa0JBQWtCLFlBQVk7QUFDcEMsUUFBTSxDQUFFLFVBQVUsUUFBUyxZQUFZO0FBRXZDLFFBQU0sU0FBUyxLQUFLLGFBQWEsQ0FBQyxLQUFLLFFBQVE7QUFDN0MsU0FBSyxLQUFLLElBQUksS0FBTSxDQUFFLE1BQU0sY0FBYyxZQUFZLFFBQVMsS0FBSztBQUFBO0FBR3RFLFNBQU8sT0FDSixPQUFPLE1BQU0sVUFBVSxNQUFNO0FBQzVCLFVBQU0sZ0JBQWdCLFlBQVk7QUFDbEMsU0FBSyxTQUFTLFdBQVcsTUFBTSw2QkFBNkIsS0FBSyxNQUFNLGdCQUFnQjtBQUN2RixTQUFLLFNBQVMsV0FBVyxHQUFHLE1BQU0sb0JBQW9CLFlBQVk7QUFBQSxLQUVuRSxHQUFHLFNBQVMsQ0FBQyxRQUErQjtBQUMzQyxRQUFJLElBQUksUUFBUSxJQUFJLFNBQVMsY0FBYztBQUN6QyxZQUFNLFNBQVMsV0FBVyxXQUFXLFlBQVk7QUFBQSxXQUM1QztBQUNMLFlBQU0sU0FBUyxXQUFXLElBQUk7QUFBQTtBQUVoQyxZQUFRLEtBQUs7QUFBQTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
