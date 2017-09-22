export default class {

  /**
   * Gets the left and top offsets of an element, optionally subtracting a second element's offsets
   */
  static getPositioning (el, subtractEl) {
    el = el.getBoundingClientRect()
    let result = {
      left: el.left + window.scrollX,
      top: el.top + window.scrollY,
      width: el.width,
      height: el.height,
    }

    if (subtractEl) {
      subtractEl = this.getPositioning(subtractEl)
      result.left -= subtractEl.left
      result.top -= subtractEl.top
    }
    return result
  }

  /**
   *
   */
  static getSnapLine (pos, snapLines, snapRange, enableSnap) {
    let snap = snapLines.find(line => { return Math.abs(line - pos) <= snapRange })
    if (!snap) {
      snapLines.push(pos)
      snap = pos
    }
    return enableSnap ? snap : pos
  }

  /**
   *
   */
  static unsetInteractable (interactable) {
    if (typeof interactable === 'object' && typeof interactable.unset === 'function') {
      interactable.unset()
    }
  }
}
