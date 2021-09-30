const sym = Symbol.for("astro.hoistedScripts");
function hoistedScripts(Components, scripts) {
  const flatScripts = [];
  const allScripts = Components.map((c) => c && c[sym]).filter((a) => a).concat(scripts).flatMap((a) => a);
  const visitedSource = new Set();
  for (let script of allScripts) {
    if (!("src" in script)) {
      flatScripts.push(script);
    } else if (!visitedSource.has(script.src)) {
      flatScripts.push(script);
      visitedSource.add(script.src);
    }
  }
  return flatScripts;
}
export {
  hoistedScripts as __astro_hoisted_scripts
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL2ludGVybmFsL19fYXN0cm9faG9pc3RlZF9zY3JpcHRzLnRzIl0sCiAgIm1hcHBpbmdzIjogIkFBRUEsTUFBTSxNQUFNLE9BQU8sSUFBSTtBQVd2Qix3QkFBd0IsWUFBbUQsU0FBdUI7QUFDaEcsUUFBTSxjQUFjO0FBRXBCLFFBQU0sYUFBMkIsV0FBVyxJQUFJLENBQUMsTUFBTSxLQUFLLEVBQUUsTUFDM0QsT0FBTyxDQUFDLE1BQU0sR0FDZCxPQUFPLFNBQ1AsUUFBUSxDQUFDLE1BQU07QUFFbEIsUUFBTSxnQkFBZ0IsSUFBSTtBQUMxQixXQUFTLFVBQVUsWUFBWTtBQUM3QixRQUFJLENBQUUsVUFBUyxTQUFTO0FBQ3RCLGtCQUFZLEtBQUs7QUFBQSxlQUNSLENBQUMsY0FBYyxJQUFJLE9BQU8sTUFBTTtBQUN6QyxrQkFBWSxLQUFLO0FBQ2pCLG9CQUFjLElBQUksT0FBTztBQUFBO0FBQUE7QUFJN0IsU0FBTztBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
