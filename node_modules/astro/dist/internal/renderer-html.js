import {h} from "./h";
async function renderToStaticMarkup(tag, props, children) {
  const html = await h(tag, props, Promise.resolve(children));
  return {
    html
  };
}
export {
  renderToStaticMarkup
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL2ludGVybmFsL3JlbmRlcmVyLWh0bWwudHMiXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUVBLG9DQUFvQyxLQUFhLE9BQTRCLFVBQWtCO0FBQzdGLFFBQU0sT0FBTyxNQUFNLEVBQUUsS0FBSyxPQUFPLFFBQVEsUUFBUTtBQUNqRCxTQUFPO0FBQUEsSUFDTDtBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
