import {defaultLogLevel} from "./logger.js";
function configureSnowpackLogger(logger) {
  if (defaultLogLevel === "debug") {
    logger.level = "debug";
  } else if (defaultLogLevel === "silent") {
    logger.level = "silent";
  }
}
export {
  configureSnowpackLogger
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3Nub3dwYWNrLWxvZ2dlci50cyJdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBRU8saUNBQWlDLFFBQStCO0FBQ3JFLE1BQUksb0JBQW9CLFNBQVM7QUFDL0IsV0FBTyxRQUFRO0FBQUEsYUFDTixvQkFBb0IsVUFBVTtBQUN2QyxXQUFPLFFBQVE7QUFBQTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
