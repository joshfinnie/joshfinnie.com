function isCustomElementTag(tag) {
  return /[-]/.test(tag);
}
function isComponentTag(tag) {
  return /^[A-Z]/.test(tag) || /^[a-z]+\./.test(tag) || isCustomElementTag(tag);
}
function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}
function positionAt(offset, text) {
  offset = clamp(offset, 0, text.length);
  const lineOffsets = getLineOffsets(text);
  let low = 0;
  let high = lineOffsets.length;
  if (high === 0) {
    return {line: 0, character: offset};
  }
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (lineOffsets[mid] > offset) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }
  const line = low - 1;
  return {line, character: offset - lineOffsets[line]};
}
function offsetAt(position, text) {
  const lineOffsets = getLineOffsets(text);
  if (position.line >= lineOffsets.length) {
    return text.length;
  } else if (position.line < 0) {
    return 0;
  }
  const lineOffset = lineOffsets[position.line];
  const nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : text.length;
  return clamp(nextLineOffset, lineOffset, lineOffset + position.character);
}
function getLineOffsets(text) {
  const lineOffsets = [];
  let isLineStart = true;
  for (let i = 0; i < text.length; i++) {
    if (isLineStart) {
      lineOffsets.push(i);
      isLineStart = false;
    }
    const ch = text.charAt(i);
    isLineStart = ch === "\r" || ch === "\n";
    if (ch === "\r" && i + 1 < text.length && text.charAt(i + 1) === "\n") {
      i++;
    }
  }
  if (isLineStart && text.length > 0) {
    lineOffsets.push(text.length);
  }
  return lineOffsets;
}
export {
  clamp,
  isComponentTag,
  isCustomElementTag,
  offsetAt,
  positionAt
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL2NvbXBpbGVyL3V0aWxzLnRzIl0sCiAgIm1hcHBpbmdzIjogIkFBQ08sNEJBQTRCLEtBQWE7QUFDOUMsU0FBTyxNQUFNLEtBQUs7QUFBQTtBQUliLHdCQUF3QixLQUFhO0FBQzFDLFNBQU8sU0FBUyxLQUFLLFFBQVEsWUFBWSxLQUFLLFFBQVEsbUJBQW1CO0FBQUE7QUFTcEUsZUFBZSxLQUFhLEtBQWEsS0FBcUI7QUFDbkUsU0FBTyxLQUFLLElBQUksS0FBSyxLQUFLLElBQUksS0FBSztBQUFBO0FBUTlCLG9CQUFvQixRQUFnQixNQUF3QjtBQUNqRSxXQUFTLE1BQU0sUUFBUSxHQUFHLEtBQUs7QUFFL0IsUUFBTSxjQUFjLGVBQWU7QUFDbkMsTUFBSSxNQUFNO0FBQ1YsTUFBSSxPQUFPLFlBQVk7QUFDdkIsTUFBSSxTQUFTLEdBQUc7QUFDZCxXQUFPLENBQUUsTUFBTSxHQUFHLFdBQVc7QUFBQTtBQUcvQixTQUFPLE1BQU0sTUFBTTtBQUNqQixVQUFNLE1BQU0sS0FBSyxNQUFPLE9BQU0sUUFBUTtBQUN0QyxRQUFJLFlBQVksT0FBTyxRQUFRO0FBQzdCLGFBQU87QUFBQSxXQUNGO0FBQ0wsWUFBTSxNQUFNO0FBQUE7QUFBQTtBQU1oQixRQUFNLE9BQU8sTUFBTTtBQUNuQixTQUFPLENBQUUsTUFBTSxXQUFXLFNBQVMsWUFBWTtBQUFBO0FBUTFDLGtCQUFrQixVQUFvQixNQUFzQjtBQUNqRSxRQUFNLGNBQWMsZUFBZTtBQUVuQyxNQUFJLFNBQVMsUUFBUSxZQUFZLFFBQVE7QUFDdkMsV0FBTyxLQUFLO0FBQUEsYUFDSCxTQUFTLE9BQU8sR0FBRztBQUM1QixXQUFPO0FBQUE7QUFHVCxRQUFNLGFBQWEsWUFBWSxTQUFTO0FBQ3hDLFFBQU0saUJBQWlCLFNBQVMsT0FBTyxJQUFJLFlBQVksU0FBUyxZQUFZLFNBQVMsT0FBTyxLQUFLLEtBQUs7QUFFdEcsU0FBTyxNQUFNLGdCQUFnQixZQUFZLGFBQWEsU0FBUztBQUFBO0FBSWpFLHdCQUF3QixNQUFjO0FBQ3BDLFFBQU0sY0FBYztBQUNwQixNQUFJLGNBQWM7QUFFbEIsV0FBUyxJQUFJLEdBQUcsSUFBSSxLQUFLLFFBQVEsS0FBSztBQUNwQyxRQUFJLGFBQWE7QUFDZixrQkFBWSxLQUFLO0FBQ2pCLG9CQUFjO0FBQUE7QUFFaEIsVUFBTSxLQUFLLEtBQUssT0FBTztBQUN2QixrQkFBYyxPQUFPLFFBQVEsT0FBTztBQUNwQyxRQUFJLE9BQU8sUUFBUSxJQUFJLElBQUksS0FBSyxVQUFVLEtBQUssT0FBTyxJQUFJLE9BQU8sTUFBTTtBQUNyRTtBQUFBO0FBQUE7QUFJSixNQUFJLGVBQWUsS0FBSyxTQUFTLEdBQUc7QUFDbEMsZ0JBQVksS0FBSyxLQUFLO0FBQUE7QUFHeEIsU0FBTztBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
