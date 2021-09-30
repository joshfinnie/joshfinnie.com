const beforeHeadElements = new Set(["!doctype", "html"]);
const validHeadElements = new Set(["title", "meta", "link", "style", "script", "noscript", "base"]);
class EndOfHead {
  constructor() {
    this.html = null;
    this.head = null;
    this.firstNonHead = null;
    this.parent = null;
    this.stack = [];
    this.foundHeadElements = false;
    this.foundBodyElements = false;
    this.append = () => void 0;
  }
  get found() {
    return !!(this.head || this.firstNonHead);
  }
  get foundHeadContent() {
    return !!this.head || this.foundHeadElements;
  }
  get foundHeadAndBodyContent() {
    return this.foundHeadContent && this.foundBodyElements;
  }
  get foundHeadOrHtmlElement() {
    return !!(this.html || this.head);
  }
  enter(node) {
    const name = node.name ? node.name.toLowerCase() : null;
    if (this.found) {
      if (!validHeadElements.has(name)) {
        if (node.type === "Element") {
          this.foundBodyElements = true;
        }
      }
      return;
    }
    this.stack.push(node);
    if (!node.name) {
      return;
    }
    if (name === "head") {
      this.head = node;
      this.parent = this.stack[this.stack.length - 2];
      this.append = this.appendToHead;
      return;
    }
    if (beforeHeadElements.has(name)) {
      if (name === "html") {
        this.html = node;
      }
      return;
    }
    if (!validHeadElements.has(name)) {
      if (node.type === "Element") {
        this.foundBodyElements = true;
      }
      this.firstNonHead = node;
      this.parent = this.stack[this.stack.length - 2];
      this.append = this.prependToFirstNonHead;
      return;
    } else {
      this.foundHeadElements = true;
    }
  }
  leave(_node) {
    this.stack.pop();
  }
  appendToHead(...nodes) {
    var _a;
    if (this.head) {
      const head = this.head;
      head.children = (_a = head.children) != null ? _a : [];
      head.children.push(...nodes);
    }
  }
  prependToFirstNonHead(...nodes) {
    var _a, _b, _c, _d;
    let idx = this.firstNonHead && ((_b = (_a = this.parent) == null ? void 0 : _a.children) == null ? void 0 : _b.indexOf(this.firstNonHead)) || 0;
    (_d = (_c = this.parent) == null ? void 0 : _c.children) == null ? void 0 : _d.splice(idx, 0, ...nodes);
  }
}
export {
  EndOfHead
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGVyL3RyYW5zZm9ybS91dGlsL2VuZC1vZi1oZWFkLnRzIl0sCiAgIm1hcHBpbmdzIjogIkFBRUEsTUFBTSxxQkFBcUIsSUFBSSxJQUFJLENBQUMsWUFBWTtBQUNoRCxNQUFNLG9CQUFvQixJQUFJLElBQUksQ0FBQyxTQUFTLFFBQVEsUUFBUSxTQUFTLFVBQVUsWUFBWTtBQUVwRixnQkFBZ0I7QUFBQSxFQUFoQixjQUxQO0FBTVUsZ0JBQTRCO0FBQzVCLGdCQUE0QjtBQUM1Qix3QkFBb0M7QUFDcEMsa0JBQThCO0FBQzlCLGlCQUF3QjtBQUV6Qiw2QkFBb0I7QUFDcEIsNkJBQW9CO0FBQ3BCLGtCQUE0QyxNQUFNO0FBQUE7QUFBQSxNQUVyRCxRQUFpQjtBQUNuQixXQUFPLENBQUMsQ0FBRSxNQUFLLFFBQVEsS0FBSztBQUFBO0FBQUEsTUFHMUIsbUJBQTRCO0FBQzlCLFdBQU8sQ0FBQyxDQUFDLEtBQUssUUFBUSxLQUFLO0FBQUE7QUFBQSxNQUd6QiwwQkFBbUM7QUFDckMsV0FBTyxLQUFLLG9CQUFvQixLQUFLO0FBQUE7QUFBQSxNQUduQyx5QkFBa0M7QUFDcEMsV0FBTyxDQUFDLENBQUUsTUFBSyxRQUFRLEtBQUs7QUFBQTtBQUFBLEVBRzlCLE1BQU0sTUFBb0I7QUFDeEIsVUFBTSxPQUFPLEtBQUssT0FBTyxLQUFLLEtBQUssZ0JBQWdCO0FBRW5ELFFBQUksS0FBSyxPQUFPO0FBQ2QsVUFBSSxDQUFDLGtCQUFrQixJQUFJLE9BQU87QUFDaEMsWUFBSSxLQUFLLFNBQVMsV0FBVztBQUMzQixlQUFLLG9CQUFvQjtBQUFBO0FBQUE7QUFHN0I7QUFBQTtBQUdGLFNBQUssTUFBTSxLQUFLO0FBR2hCLFFBQUksQ0FBQyxLQUFLLE1BQU07QUFDZDtBQUFBO0FBR0YsUUFBSSxTQUFTLFFBQVE7QUFDbkIsV0FBSyxPQUFPO0FBQ1osV0FBSyxTQUFTLEtBQUssTUFBTSxLQUFLLE1BQU0sU0FBUztBQUM3QyxXQUFLLFNBQVMsS0FBSztBQUNuQjtBQUFBO0FBSUYsUUFBSSxtQkFBbUIsSUFBSSxPQUFPO0FBQ2hDLFVBQUksU0FBUyxRQUFRO0FBQ25CLGFBQUssT0FBTztBQUFBO0FBRWQ7QUFBQTtBQUdGLFFBQUksQ0FBQyxrQkFBa0IsSUFBSSxPQUFPO0FBQ2hDLFVBQUksS0FBSyxTQUFTLFdBQVc7QUFDM0IsYUFBSyxvQkFBb0I7QUFBQTtBQUUzQixXQUFLLGVBQWU7QUFDcEIsV0FBSyxTQUFTLEtBQUssTUFBTSxLQUFLLE1BQU0sU0FBUztBQUM3QyxXQUFLLFNBQVMsS0FBSztBQUNuQjtBQUFBLFdBQ0s7QUFDTCxXQUFLLG9CQUFvQjtBQUFBO0FBQUE7QUFBQSxFQUk3QixNQUFNLE9BQXFCO0FBQ3pCLFNBQUssTUFBTTtBQUFBO0FBQUEsRUFHTCxnQkFBZ0IsT0FBdUI7QUFuRmpEO0FBb0ZJLFFBQUksS0FBSyxNQUFNO0FBQ2IsWUFBTSxPQUFPLEtBQUs7QUFDbEIsV0FBSyxXQUFXLFdBQUssYUFBTCxZQUFpQjtBQUNqQyxXQUFLLFNBQVMsS0FBSyxHQUFHO0FBQUE7QUFBQTtBQUFBLEVBSWxCLHlCQUF5QixPQUF1QjtBQTNGMUQ7QUE0RkksUUFBSSxNQUFlLEtBQUssZ0JBQWdCLGtCQUFLLFdBQUwsbUJBQWEsYUFBYixtQkFBdUIsUUFBUSxLQUFLLGtCQUFrQjtBQUM5RixxQkFBSyxXQUFMLG1CQUFhLGFBQWIsbUJBQXVCLE9BQU8sS0FBSyxHQUFHLEdBQUc7QUFBQTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
