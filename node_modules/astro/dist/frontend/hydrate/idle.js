async function onIdle(astroId, _options, getHydrateCallback) {
  const cb = async () => {
    var _a, _b;
    const roots = document.querySelectorAll(`astro-root[uid="${astroId}"]`);
    const innerHTML = (_b = (_a = roots[0].querySelector(`astro-fragment`)) == null ? void 0 : _a.innerHTML) != null ? _b : null;
    const hydrate = await getHydrateCallback();
    for (const root of roots) {
      hydrate(root, innerHTML);
    }
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(cb);
  } else {
    setTimeout(cb, 200);
  }
}
export {
  onIdle as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL2Zyb250ZW5kL2h5ZHJhdGUvaWRsZS50cyJdLAogICJtYXBwaW5ncyI6ICJBQU1BLHNCQUFxQyxTQUFpQixVQUEwQixvQkFBd0M7QUFDdEgsUUFBTSxLQUFLLFlBQVk7QUFQekI7QUFRSSxVQUFNLFFBQVEsU0FBUyxpQkFBaUIsbUJBQW1CO0FBQzNELFVBQU0sWUFBWSxrQkFBTSxHQUFHLGNBQWMsc0JBQXZCLG1CQUEwQyxjQUExQyxZQUF1RDtBQUN6RSxVQUFNLFVBQVUsTUFBTTtBQUV0QixlQUFXLFFBQVEsT0FBTztBQUN4QixjQUFRLE1BQU07QUFBQTtBQUFBO0FBSWxCLE1BQUkseUJBQXlCLFFBQVE7QUFDbkMsSUFBQyxPQUFlLG9CQUFvQjtBQUFBLFNBQy9CO0FBQ0wsZUFBVyxJQUFJO0FBQUE7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
