import {EndOfHead} from "./util/end-of-head.js";
function head_default(opts) {
  let hasComponents = false;
  let isHmrEnabled = typeof opts.compileOptions.hmrPort !== "undefined" && opts.compileOptions.mode === "development";
  const eoh = new EndOfHead();
  return {
    visitors: {
      html: {
        Fragment: {
          enter(node) {
            eoh.enter(node);
          },
          leave(node) {
            eoh.leave(node);
          }
        },
        InlineComponent: {
          enter(node) {
            if (hasComponents) {
              return;
            }
            eoh.enter(node);
            if (node.attributes && node.attributes.some(({name}) => name == null ? void 0 : name.startsWith("client:"))) {
              hasComponents = true;
              return;
            }
            const [_name, kind] = node.name.split(":");
            if (kind) {
              hasComponents = true;
            }
          },
          leave(node) {
            eoh.leave(node);
          }
        },
        Element: {
          enter(node) {
            eoh.enter(node);
          },
          leave(node) {
            eoh.leave(node);
          }
        }
      }
    },
    async finalize() {
      const children = [];
      children.push({
        start: 0,
        end: 0,
        type: "Fragment",
        children: [
          {
            start: 0,
            end: 0,
            type: "Expression",
            codeChunks: ["Astro.pageCSS.map(css => (", "))"],
            children: [
              {
                type: "Element",
                name: "link",
                attributes: [
                  {
                    name: "rel",
                    type: "Attribute",
                    value: [
                      {
                        type: "Text",
                        raw: "stylesheet",
                        data: "stylesheet"
                      }
                    ]
                  },
                  {
                    name: "href",
                    type: "Attribute",
                    value: [
                      {
                        start: 0,
                        end: 0,
                        type: "MustacheTag",
                        expression: {
                          start: 0,
                          end: 0,
                          type: "Expression",
                          codeChunks: ["css"],
                          children: []
                        }
                      }
                    ]
                  }
                ],
                start: 0,
                end: 0,
                children: []
              }
            ]
          },
          {
            start: 0,
            end: 0,
            type: "Expression",
            codeChunks: ["Astro.pageScripts.map(script => (", "))"],
            children: [
              {
                start: 0,
                end: 0,
                type: "Expression",
                codeChunks: ["script.src ? (", ") : (", ")"],
                children: [
                  {
                    type: "Element",
                    name: "script",
                    attributes: [
                      {
                        type: "Attribute",
                        name: "type",
                        value: [
                          {
                            type: "Text",
                            raw: "module",
                            data: "module"
                          }
                        ]
                      },
                      {
                        type: "Attribute",
                        name: "src",
                        value: [
                          {
                            start: 0,
                            end: 0,
                            type: "MustacheTag",
                            expression: {
                              start: 0,
                              end: 0,
                              type: "Expression",
                              codeChunks: ["script.src"],
                              children: []
                            }
                          }
                        ]
                      },
                      {
                        type: "Attribute",
                        name: "data-astro",
                        value: [
                          {
                            type: "Text",
                            raw: "hoist",
                            data: "hoist"
                          }
                        ]
                      }
                    ],
                    start: 0,
                    end: 0,
                    children: []
                  },
                  {
                    type: "Element",
                    name: "script",
                    attributes: [
                      {
                        type: "Attribute",
                        name: "type",
                        value: [
                          {
                            type: "Text",
                            raw: "module",
                            data: "module"
                          }
                        ]
                      },
                      {
                        type: "Attribute",
                        name: "data-astro",
                        value: [
                          {
                            type: "Text",
                            raw: "hoist",
                            data: "hoist"
                          }
                        ]
                      }
                    ],
                    start: 0,
                    end: 0,
                    children: [
                      {
                        start: 0,
                        end: 0,
                        type: "MustacheTag",
                        expression: {
                          start: 0,
                          end: 0,
                          type: "Expression",
                          codeChunks: ["script.content"],
                          children: []
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });
      if (hasComponents) {
        children.push({
          type: "Element",
          name: "style",
          attributes: [{name: "type", type: "Attribute", value: [{type: "Text", raw: "text/css", data: "text/css"}]}],
          start: 0,
          end: 0,
          children: [
            {
              start: 0,
              end: 0,
              type: "Text",
              data: "astro-root, astro-fragment { display: contents; }",
              raw: "astro-root, astro-fragment { display: contents; }"
            }
          ]
        });
      }
      if (isHmrEnabled) {
        const {hmrPort} = opts.compileOptions;
        children.push({
          type: "Element",
          name: "script",
          attributes: [],
          children: [{type: "Text", data: `window.HMR_WEBSOCKET_PORT = ${hmrPort};`, start: 0, end: 0}],
          start: 0,
          end: 0
        }, {
          type: "Element",
          name: "script",
          attributes: [
            {type: "Attribute", name: "type", value: [{type: "Text", data: "module", start: 0, end: 0}], start: 0, end: 0},
            {type: "Attribute", name: "src", value: [{type: "Text", data: "/_snowpack/hmr-client.js", start: 0, end: 0}], start: 0, end: 0}
          ],
          children: [],
          start: 0,
          end: 0
        });
      }
      if (eoh.foundHeadOrHtmlElement || eoh.foundHeadAndBodyContent) {
        const topLevelFragment = {
          start: 0,
          end: 0,
          type: "Fragment",
          children
        };
        eoh.append(topLevelFragment);
      }
    }
  };
}
export {
  head_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL2NvbXBpbGVyL3RyYW5zZm9ybS9oZWFkLnRzIl0sCiAgIm1hcHBpbmdzIjogIkFBRUE7QUFHZSxzQkFBVSxNQUFxQztBQUM1RCxNQUFJLGdCQUFnQjtBQUNwQixNQUFJLGVBQWUsT0FBTyxLQUFLLGVBQWUsWUFBWSxlQUFlLEtBQUssZUFBZSxTQUFTO0FBQ3RHLFFBQU0sTUFBTSxJQUFJO0FBRWhCLFNBQU87QUFBQSxJQUNMLFVBQVU7QUFBQSxNQUNSLE1BQU07QUFBQSxRQUNKLFVBQVU7QUFBQSxVQUNSLE1BQU0sTUFBTTtBQUNWLGdCQUFJLE1BQU07QUFBQTtBQUFBLFVBRVosTUFBTSxNQUFNO0FBQ1YsZ0JBQUksTUFBTTtBQUFBO0FBQUE7QUFBQSxRQUdkLGlCQUFpQjtBQUFBLFVBQ2YsTUFBTSxNQUFNO0FBQ1YsZ0JBQUksZUFBZTtBQUNqQjtBQUFBO0FBR0YsZ0JBQUksTUFBTTtBQUNWLGdCQUFJLEtBQUssY0FBYyxLQUFLLFdBQVcsS0FBSyxDQUFDLENBQUUsVUFBZ0IsNkJBQU0sV0FBVyxhQUFhO0FBQzNGLDhCQUFnQjtBQUNoQjtBQUFBO0FBSUYsa0JBQU0sQ0FBQyxPQUFPLFFBQVEsS0FBSyxLQUFLLE1BQU07QUFDdEMsZ0JBQUksTUFBTTtBQUNSLDhCQUFnQjtBQUFBO0FBQUE7QUFBQSxVQUdwQixNQUFNLE1BQU07QUFDVixnQkFBSSxNQUFNO0FBQUE7QUFBQTtBQUFBLFFBR2QsU0FBUztBQUFBLFVBQ1AsTUFBTSxNQUFNO0FBQ1YsZ0JBQUksTUFBTTtBQUFBO0FBQUEsVUFFWixNQUFNLE1BQU07QUFDVixnQkFBSSxNQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUtaLFdBQVc7QUFDZixZQUFNLFdBQVc7QUFZakIsZUFBUyxLQUFLO0FBQUEsUUFDWixPQUFPO0FBQUEsUUFDUCxLQUFLO0FBQUEsUUFDTCxNQUFNO0FBQUEsUUFDTixVQUFVO0FBQUEsVUFDUjtBQUFBLFlBQ0UsT0FBTztBQUFBLFlB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
