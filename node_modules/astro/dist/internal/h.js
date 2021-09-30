const voidTags = new Set(["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]);
function* _children(children) {
  for (let child of children) {
    if (typeof child === "function") {
      yield child();
    } else if (typeof child === "string") {
      yield child;
    } else if (!child && child !== 0) {
    } else {
      yield child;
    }
  }
}
function* _h(tag, attrs, children) {
  if (tag.toLowerCase() === "!doctype") {
    yield `<${tag} `;
    if (attrs) {
      yield Object.keys(attrs).join(" ");
    }
    yield ">";
    return;
  }
  yield `<${tag}`;
  if (attrs) {
    for (let [key, value] of Object.entries(attrs)) {
      if (value === "")
        yield ` ${key}=""`;
      else if (value == null || value === false)
        yield "";
      else if (value === true)
        yield ` ${key}`;
      else
        yield ` ${key}="${value}"`;
    }
  }
  yield ">";
  if (voidTags.has(tag)) {
    return;
  }
  yield* _children(children);
  yield `</${tag}>`;
}
async function h(tag, attrs, ...pChildren) {
  const children = await Promise.all(pChildren.flat(Infinity));
  if (typeof tag === "function") {
    return tag(attrs, ...children);
  }
  return Array.from(_h(tag, attrs, children)).join("");
}
function Fragment(_, ...children) {
  return Array.from(_children(children)).join("");
}
export {
  Fragment,
  h
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL2ludGVybmFsL2gudHMiXSwKICAibWFwcGluZ3MiOiAiQUFLQSxNQUFNLFdBQVcsSUFBSSxJQUFJLENBQUMsUUFBUSxRQUFRLE1BQU0sT0FBTyxXQUFXLFNBQVMsTUFBTSxPQUFPLFNBQVMsVUFBVSxRQUFRLFFBQVEsU0FBUyxVQUFVLFNBQVM7QUFFdkosb0JBQW9CLFVBQXlCO0FBQzNDLFdBQVMsU0FBUyxVQUFVO0FBSTFCLFFBQUksT0FBTyxVQUFVLFlBQVk7QUFDL0IsWUFBTTtBQUFBLGVBQ0csT0FBTyxVQUFVLFVBQVU7QUFDcEMsWUFBTTtBQUFBLGVBQ0csQ0FBQyxTQUFTLFVBQVUsR0FBRztBQUFBLFdBRTNCO0FBQ0wsWUFBTTtBQUFBO0FBQUE7QUFBQTtBQU1aLGFBQWEsS0FBYSxPQUFlLFVBQXlCO0FBQ2hFLE1BQUksSUFBSSxrQkFBa0IsWUFBWTtBQUNwQyxVQUFNLElBQUk7QUFDVixRQUFJLE9BQU87QUFDVCxZQUFNLE9BQU8sS0FBSyxPQUFPLEtBQUs7QUFBQTtBQUVoQyxVQUFNO0FBQ047QUFBQTtBQUdGLFFBQU0sSUFBSTtBQUNWLE1BQUksT0FBTztBQUNULGFBQVMsQ0FBQyxLQUFLLFVBQVUsT0FBTyxRQUFRLFFBQVE7QUFDOUMsVUFBSSxVQUFVO0FBQUksY0FBTSxJQUFJO0FBQUEsZUFDbkIsU0FBUyxRQUFRLFVBQVU7QUFBTyxjQUFNO0FBQUEsZUFDeEMsVUFBVTtBQUFNLGNBQU0sSUFBSTtBQUFBO0FBQzlCLGNBQU0sSUFBSSxRQUFRO0FBQUE7QUFBQTtBQUczQixRQUFNO0FBR04sTUFBSSxTQUFTLElBQUksTUFBTTtBQUNyQjtBQUFBO0FBR0YsU0FBTyxVQUFVO0FBRWpCLFFBQU0sS0FBSztBQUFBO0FBSWIsaUJBQXdCLEtBQVcsVUFBa0IsV0FBbUM7QUFDdEYsUUFBTSxXQUFXLE1BQU0sUUFBUSxJQUFJLFVBQVUsS0FBSztBQUNsRCxNQUFJLE9BQU8sUUFBUSxZQUFZO0FBRTdCLFdBQU8sSUFBSSxPQUFPLEdBQUc7QUFBQTtBQUd2QixTQUFPLE1BQU0sS0FBSyxHQUFHLEtBQUssT0FBTyxXQUFXLEtBQUs7QUFBQTtBQUk1QyxrQkFBa0IsTUFBYyxVQUF5QjtBQUM5RCxTQUFPLE1BQU0sS0FBSyxVQUFVLFdBQVcsS0FBSztBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
