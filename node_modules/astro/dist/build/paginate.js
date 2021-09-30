var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
function generatePaginateFunction(routeMatch) {
  return function paginateUtility(data, args = {}) {
    let {pageSize: _pageSize, params: _params, props: _props} = args;
    const pageSize = _pageSize || 10;
    const paramName = "page";
    const additoonalParams = _params || {};
    const additoonalProps = _props || {};
    let includesFirstPageNumber;
    if (routeMatch.params.includes(`...${paramName}`)) {
      includesFirstPageNumber = false;
    } else if (routeMatch.params.includes(`${paramName}`)) {
      includesFirstPageNumber = true;
    } else {
      throw new Error(`[paginate()] page number param \`${paramName}\` not found in your filepath.
Rename your file to \`[...page].astro\` or customize the param name via the \`paginate([], {param: '...'}\` option.`);
    }
    const lastPage = Math.max(1, Math.ceil(data.length / pageSize));
    const result = [...Array(lastPage).keys()].map((num) => {
      const pageNum = num + 1;
      const start = pageSize === Infinity ? 0 : (pageNum - 1) * pageSize;
      const end = Math.min(start + pageSize, data.length);
      const params = __spreadProps(__spreadValues({}, additoonalParams), {
        [paramName]: includesFirstPageNumber || pageNum > 1 ? String(pageNum) : void 0
      });
      return {
        params,
        props: __spreadProps(__spreadValues({}, additoonalProps), {
          page: {
            data: data.slice(start, end),
            start,
            end: end - 1,
            size: pageSize,
            total: data.length,
            currentPage: pageNum,
            lastPage,
            url: {
              current: routeMatch.generate(__spreadValues({}, params)),
              next: pageNum === lastPage ? void 0 : routeMatch.generate(__spreadProps(__spreadValues({}, params), {page: String(pageNum + 1)})),
              prev: pageNum === 1 ? void 0 : routeMatch.generate(__spreadProps(__spreadValues({}, params), {page: !includesFirstPageNumber && pageNum - 1 === 1 ? void 0 : String(pageNum - 1)}))
            }
          }
        })
      };
    });
    return result;
  };
}
export {
  generatePaginateFunction
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL2J1aWxkL3BhZ2luYXRlLnRzIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVlPLGtDQUFrQyxZQUF5QztBQUNoRixTQUFPLHlCQUF5QixNQUFhLE9BQThELElBQUk7QUFDN0csUUFBSSxDQUFFLFVBQVUsV0FBVyxRQUFRLFNBQVMsT0FBTyxVQUFXO0FBQzlELFVBQU0sV0FBVyxhQUFhO0FBQzlCLFVBQU0sWUFBWTtBQUNsQixVQUFNLG1CQUFtQixXQUFXO0FBQ3BDLFVBQU0sa0JBQWtCLFVBQVU7QUFDbEMsUUFBSTtBQUNKLFFBQUksV0FBVyxPQUFPLFNBQVMsTUFBTSxjQUFjO0FBQ2pELGdDQUEwQjtBQUFBLGVBQ2pCLFdBQVcsT0FBTyxTQUFTLEdBQUcsY0FBYztBQUNyRCxnQ0FBMEI7QUFBQSxXQUNyQjtBQUNMLFlBQU0sSUFBSSxNQUNSLG9DQUFvQztBQUFBO0FBQUE7QUFHeEMsVUFBTSxXQUFXLEtBQUssSUFBSSxHQUFHLEtBQUssS0FBSyxLQUFLLFNBQVM7QUFFckQsVUFBTSxTQUErQixDQUFDLEdBQUcsTUFBTSxVQUFVLFFBQVEsSUFBSSxDQUFDLFFBQVE7QUFDNUUsWUFBTSxVQUFVLE1BQU07QUFDdEIsWUFBTSxRQUFRLGFBQWEsV0FBVyxJQUFLLFdBQVUsS0FBSztBQUMxRCxZQUFNLE1BQU0sS0FBSyxJQUFJLFFBQVEsVUFBVSxLQUFLO0FBQzVDLFlBQU0sU0FBUyxpQ0FDVixtQkFEVTtBQUFBLFNBRVosWUFBWSwyQkFBMkIsVUFBVSxJQUFJLE9BQU8sV0FBVztBQUFBO0FBRTFFLGFBQU87QUFBQSxRQUNMO0FBQUEsUUFDQSxPQUFPLGlDQUNGLGtCQURFO0FBQUEsVUFFTCxNQUFNO0FBQUEsWUFDSixNQUFNLEtBQUssTUFBTSxPQUFPO0FBQUEsWUFDeEI7QUFBQSxZQUNBLEtBQUssTUFBTTtBQUFBLFlBQ1gsTUFBTTtBQUFBLFlBQ04sT0FBTyxLQUFLO0FBQUEsWUFDWixhQUFhO0FBQUEsWUFDYjtBQUFBLFlBQ0EsS0FBSztBQUFBLGNBQ0gsU0FBUyxXQUFXLFNBQVMsbUJBQUs7QUFBQSxjQUNsQyxNQUFNLFlBQVksV0FBVyxTQUFZLFdBQVcsU0FBUyxpQ0FBSyxTQUFMLENBQWEsTUFBTSxPQUFPLFVBQVU7QUFBQSxjQUNqRyxNQUFNLFlBQVksSUFBSSxTQUFZLFdBQVcsU0FBUyxpQ0FBSyxTQUFMLENBQWEsTUFBTSxDQUFDLDJCQUEyQixVQUFVLE1BQU0sSUFBSSxTQUFZLE9BQU8sVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNaEssV0FBTztBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
