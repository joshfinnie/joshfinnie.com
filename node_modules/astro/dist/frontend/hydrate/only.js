async function onLoad(astroId, _options, getHydrateCallback) {
  var _a, _b;
  const roots = document.querySelectorAll(`astro-root[uid="${astroId}"]`);
  const innerHTML = (_b = (_a = roots[0].querySelector(`astro-fragment`)) == null ? void 0 : _a.innerHTML) != null ? _b : null;
  const hydrate = await getHydrateCallback();
  for (const root of roots) {
    hydrate(root, innerHTML);
  }
}
export {
  onLoad as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL2Zyb250ZW5kL2h5ZHJhdGUvb25seS50cyJdLAogICJtYXBwaW5ncyI6ICJBQUtBLHNCQUFxQyxTQUFpQixVQUEwQixvQkFBd0M7QUFMeEg7QUFNRSxRQUFNLFFBQVEsU0FBUyxpQkFBaUIsbUJBQW1CO0FBQzNELFFBQU0sWUFBWSxrQkFBTSxHQUFHLGNBQWMsc0JBQXZCLG1CQUEwQyxjQUExQyxZQUF1RDtBQUN6RSxRQUFNLFVBQVUsTUFBTTtBQUV0QixhQUFXLFFBQVEsT0FBTztBQUN4QixZQUFRLE1BQU07QUFBQTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
