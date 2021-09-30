async function onMedia(astroId, options, getHydrateCallback) {
  var _a, _b;
  const roots = document.querySelectorAll(`astro-root[uid="${astroId}"]`);
  const innerHTML = (_b = (_a = roots[0].querySelector(`astro-fragment`)) == null ? void 0 : _a.innerHTML) != null ? _b : null;
  const cb = async () => {
    const hydrate = await getHydrateCallback();
    for (const root of roots) {
      hydrate(root, innerHTML);
    }
  };
  if (options.value) {
    const mql = matchMedia(options.value);
    if (mql.matches) {
      cb();
    } else {
      mql.addEventListener("change", cb, {once: true});
    }
  }
}
export {
  onMedia as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL2Zyb250ZW5kL2h5ZHJhdGUvbWVkaWEudHMiXSwKICAibWFwcGluZ3MiOiAiQUFLQSx1QkFBc0MsU0FBaUIsU0FBeUIsb0JBQXdDO0FBTHhIO0FBTUUsUUFBTSxRQUFRLFNBQVMsaUJBQWlCLG1CQUFtQjtBQUMzRCxRQUFNLFlBQVksa0JBQU0sR0FBRyxjQUFjLHNCQUF2QixtQkFBMEMsY0FBMUMsWUFBdUQ7QUFFekUsUUFBTSxLQUFLLFlBQVk7QUFDckIsVUFBTSxVQUFVLE1BQU07QUFDdEIsZUFBVyxRQUFRLE9BQU87QUFDeEIsY0FBUSxNQUFNO0FBQUE7QUFBQTtBQUlsQixNQUFJLFFBQVEsT0FBTztBQUNqQixVQUFNLE1BQU0sV0FBVyxRQUFRO0FBQy9CLFFBQUksSUFBSSxTQUFTO0FBQ2Y7QUFBQSxXQUNLO0FBQ0wsVUFBSSxpQkFBaUIsVUFBVSxJQUFJLENBQUUsTUFBTTtBQUFBO0FBQUE7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
