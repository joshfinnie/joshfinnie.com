async function importPlugin(p) {
  if (typeof p === "string") {
    return await import(p);
  }
  return await p;
}
function loadPlugins(items) {
  return items.map((p) => {
    return new Promise((resolve, reject) => {
      if (Array.isArray(p)) {
        const [plugin, opts] = p;
        return importPlugin(plugin).then((m) => resolve([m.default, opts])).catch((e) => reject(e));
      }
      return importPlugin(p).then((m) => resolve([m.default])).catch((e) => reject(e));
    });
  });
}
export {
  loadPlugins
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL2xvYWQtcGx1Z2lucy50cyJdLAogICJtYXBwaW5ncyI6ICJBQUdBLDRCQUE0QixHQUFzRDtBQUNoRixNQUFJLE9BQU8sTUFBTSxVQUFVO0FBQ3pCLFdBQU8sTUFBTSxPQUFPO0FBQUE7QUFHdEIsU0FBTyxNQUFNO0FBQUE7QUFHUixxQkFBcUIsT0FBc0U7QUFDaEcsU0FBTyxNQUFNLElBQUksQ0FBQyxNQUFNO0FBQ3RCLFdBQU8sSUFBSSxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQ3RDLFVBQUksTUFBTSxRQUFRLElBQUk7QUFDcEIsY0FBTSxDQUFDLFFBQVEsUUFBUTtBQUN2QixlQUFPLGFBQWEsUUFDakIsS0FBSyxDQUFDLE1BQU0sUUFBUSxDQUFDLEVBQUUsU0FBUyxRQUNoQyxNQUFNLENBQUMsTUFBTSxPQUFPO0FBQUE7QUFHekIsYUFBTyxhQUFhLEdBQ2pCLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQyxFQUFFLFdBQ3ZCLE1BQU0sQ0FBQyxNQUFNLE9BQU87QUFBQTtBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
