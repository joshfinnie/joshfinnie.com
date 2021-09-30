function getAttr(attributes, name) {
  const attr = attributes.find((a) => a.name === name);
  return attr;
}
function getAttrValue(attributes, name) {
  var _a;
  if (attributes.length === 0)
    return "";
  const attr = getAttr(attributes, name);
  if (attr) {
    return (_a = attr.value[0]) == null ? void 0 : _a.data;
  }
}
function setAttrValue(attributes, name, value) {
  const attr = attributes.find((a) => a.name === name);
  if (attr && attr.value[0]) {
    attr.value[0].data = value;
    attr.value[0].raw = value;
  }
}
export {
  getAttr,
  getAttrValue,
  setAttrValue
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL2FzdC50cyJdLAogICJtYXBwaW5ncyI6ICJBQUtPLGlCQUFpQixZQUF5QixNQUFxQztBQUNwRixRQUFNLE9BQU8sV0FBVyxLQUFLLENBQUMsTUFBTSxFQUFFLFNBQVM7QUFDL0MsU0FBTztBQUFBO0FBSUYsc0JBQXNCLFlBQXlCLE1BQWtDO0FBWHhGO0FBWUUsTUFBSSxXQUFXLFdBQVc7QUFBRyxXQUFPO0FBQ3BDLFFBQU0sT0FBTyxRQUFRLFlBQVk7QUFDakMsTUFBSSxNQUFNO0FBQ1IsV0FBTyxXQUFLLE1BQU0sT0FBWCxtQkFBZTtBQUFBO0FBQUE7QUFLbkIsc0JBQXNCLFlBQXlCLE1BQWMsT0FBcUI7QUFDdkYsUUFBTSxPQUFPLFdBQVcsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTO0FBQy9DLE1BQUksUUFBUSxLQUFLLE1BQU0sSUFBSTtBQUN6QixTQUFLLE1BQU0sR0FBRyxPQUFPO0FBQ3JCLFNBQUssTUFBTSxHQUFHLE1BQU07QUFBQTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
