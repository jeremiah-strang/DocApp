/**
 * Gets the left and top offsets of an element, optionally subtracting a second element's offsets
 */
exports.getPositioning = (el, subtractEl) => {
  el = el.getBoundingClientRect()
  let result = {
    left: el.left + window.scrollX,
    top: el.top + window.scrollY,
    width: el.width,
    height: el.height,
  }

  if (subtractEl) {
    subtractEl = exports.getPositioning(subtractEl)
    result.left -= subtractEl.left
    result.top -= subtractEl.top
  }
  return result
}

/**
 *
 */
exports.getSnapLine = (pos, snapLines, snapRange) => {
  let snap = snapLines.find(line => { return Math.abs(line - pos) <= snapRange })
  if (!snap) {
    snapLines.push(pos)
    return pos
  }
  return snap
}
