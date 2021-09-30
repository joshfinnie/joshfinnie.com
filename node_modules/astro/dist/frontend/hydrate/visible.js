async function onVisible(astroId, _options, getHydrateCallback) {
  var _a, _b;
  const roots = document.querySelectorAll(`astro-root[uid="${astroId}"]`);
  const innerHTML = (_b = (_a = roots[0].querySelector(`astro-fragment`)) == null ? void 0 : _a.innerHTML) != null ? _b : null;
  const cb = async () => {
    const hydrate = await getHydrateCallback();
    for (const root of roots) {
      hydrate(root, innerHTML);
    }
  };
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting)
      return;
    io.disconnect();
    cb();
  });
  for (const root of roots) {
    for (let i = 0; i < root.children.length; i++) {
      const child = root.children[i];
      io.observe(child);
    }
  }
}
export {
  onVisible as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL2Zyb250ZW5kL2h5ZHJhdGUvdmlzaWJsZS50cyJdLAogICJtYXBwaW5ncyI6ICJBQU9BLHlCQUF3QyxTQUFpQixVQUEwQixvQkFBd0M7QUFQM0g7QUFRRSxRQUFNLFFBQVEsU0FBUyxpQkFBaUIsbUJBQW1CO0FBQzNELFFBQU0sWUFBWSxrQkFBTSxHQUFHLGNBQWMsc0JBQXZCLG1CQUEwQyxjQUExQyxZQUF1RDtBQUV6RSxRQUFNLEtBQUssWUFBWTtBQUNyQixVQUFNLFVBQVUsTUFBTTtBQUN0QixlQUFXLFFBQVEsT0FBTztBQUN4QixjQUFRLE1BQU07QUFBQTtBQUFBO0FBSWxCLFFBQU0sS0FBSyxJQUFJLHFCQUFxQixDQUFDLENBQUMsV0FBVztBQUMvQyxRQUFJLENBQUMsTUFBTTtBQUFnQjtBQUUzQixPQUFHO0FBQ0g7QUFBQTtBQUdGLGFBQVcsUUFBUSxPQUFPO0FBQ3hCLGFBQVMsSUFBSSxHQUFHLElBQUksS0FBSyxTQUFTLFFBQVEsS0FBSztBQUM3QyxZQUFNLFFBQVEsS0FBSyxTQUFTO0FBQzVCLFNBQUcsUUFBUTtBQUFBO0FBQUE7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
