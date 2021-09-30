function __astro_slot_content({name}, ...children) {
  return {$slot: name, children};
}
const __astro_slot = ({name = "default"}, _children, ...fallback) => {
  if (name === "default" && typeof _children === "string") {
    return _children ? _children : fallback;
  }
  if (!_children || !_children.$slots) {
    throw new Error(`__astro_slot encountered an unexpected child:
${JSON.stringify(_children)}`);
  }
  const children = _children.$slots[name];
  return children ? children : fallback;
};
export {
  __astro_slot,
  __astro_slot_content
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL2ludGVybmFsL19fYXN0cm9fc2xvdC50cyJdLAogICJtYXBwaW5ncyI6ICJBQUNPLDhCQUE4QixDQUFFLFVBQTZCLFVBQWlCO0FBQ25GLFNBQU8sQ0FBRSxPQUFPLE1BQU07QUFBQTtBQUdqQixNQUFNLGVBQWUsQ0FBQyxDQUFFLE9BQU8sWUFBK0IsY0FBbUIsYUFBdUI7QUFDN0csTUFBSSxTQUFTLGFBQWEsT0FBTyxjQUFjLFVBQVU7QUFDdkQsV0FBTyxZQUFZLFlBQVk7QUFBQTtBQUVqQyxNQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsUUFBUTtBQUNuQyxVQUFNLElBQUksTUFBTTtBQUFBLEVBQWtELEtBQUssVUFBVTtBQUFBO0FBRW5GLFFBQU0sV0FBVyxVQUFVLE9BQU87QUFDbEMsU0FBTyxXQUFXLFdBQVc7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
