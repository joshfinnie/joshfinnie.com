function doctype_default(_opts) {
  let hasDoctype = false;
  return {
    visitors: {
      html: {
        Element: {
          enter(node, parent, _key, index) {
            if (node.name.toLowerCase() === "!doctype") {
              hasDoctype = true;
            }
            if (node.name === "html" && !hasDoctype) {
              const dtNode = {
                start: 0,
                end: 0,
                attributes: [{type: "Attribute", name: "html", value: true, start: 0, end: 0}],
                children: [],
                name: "!doctype",
                type: "Element"
              };
              (parent.children || []).splice(index, 0, dtNode);
              hasDoctype = true;
            }
          }
        }
      }
    },
    async finalize() {
    }
  };
}
export {
  doctype_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL2NvbXBpbGVyL3RyYW5zZm9ybS9kb2N0eXBlLnRzIl0sCiAgIm1hcHBpbmdzIjogIkFBR2UseUJBQVUsT0FBMEQ7QUFDakYsTUFBSSxhQUFhO0FBRWpCLFNBQU87QUFBQSxJQUNMLFVBQVU7QUFBQSxNQUNSLE1BQU07QUFBQSxRQUNKLFNBQVM7QUFBQSxVQUNQLE1BQU0sTUFBTSxRQUFRLE1BQU0sT0FBTztBQUMvQixnQkFBSSxLQUFLLEtBQUssa0JBQWtCLFlBQVk7QUFDMUMsMkJBQWE7QUFBQTtBQUVmLGdCQUFJLEtBQUssU0FBUyxVQUFVLENBQUMsWUFBWTtBQUN2QyxvQkFBTSxTQUFTO0FBQUEsZ0JBQ2IsT0FBTztBQUFBLGdCQUNQLEtBQUs7QUFBQSxnQkFDTCxZQUFZLENBQUMsQ0FBRSxNQUFNLGFBQWEsTUFBTSxRQUFRLE9BQU8sTUFBTSxPQUFPLEdBQUcsS0FBSztBQUFBLGdCQUM1RSxVQUFVO0FBQUEsZ0JBQ1YsTUFBTTtBQUFBLGdCQUNOLE1BQU07QUFBQTtBQUVSLGNBQUMsUUFBTyxZQUFZLElBQUksT0FBTyxPQUFPLEdBQUc7QUFDekMsMkJBQWE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFNakIsV0FBVztBQUFBO0FBQUE7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
