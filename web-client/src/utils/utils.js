import numeral from 'numeral'
import XDate from 'xdate'

export default class {

  /**
   * Gets the left and top offsets of an element, optionally subtracting a second element's offsets
   */
  static getPositioning (el, scrollEl, subtractEl) {
    el = el.getBoundingClientRect()
    let result = {
      left: el.left + window.scrollX,
      top: el.top + window.scrollY,
      width: el.width,
      height: el.height,
    }

    if (scrollEl) {
      result.left += scrollEl.scrollLeft
      result.top += scrollEl.scrollTop
    }

    if (subtractEl) {
      subtractEl = subtractEl.getBoundingClientRect()
      result.left -= subtractEl.left
      result.top -= subtractEl.top
    }
    return result
  }

  /**
   *
   */
  static unsetInteractable (interactable) {
    if (typeof interactable === 'object' && typeof interactable.unset === 'function') {
      interactable.unset()
    }
  }

  /**
   *
   */
  static capitalizeWord (text) {
    let res = '' + text
    if (res.length > 0) {
      res = res.substring(0, 1).toUpperCase() + res.substring(1, res.length)
    }
    return res
  }

  /**
   *
   */
  static getDefaultDocFieldText (docField) {
    switch (docField.type) {
      case 'text':
        return 'Example text'
      case 'number':
        let num = 12345.67
        return docField.numberFormat ? numeral(num).format(docField.numberFormat) : num
      case 'date':
        let dateStr = (new XDate(2017, 0, 1)).toString(docField.dateFormat)
        return dateStr
      case 'phone':
        return '555-555-1234'
      case 'signature':
        return 'Signature'
      case 'check':
      case 'checkx':
      case 'checksq':
        return ' '
    }
    return ''
  }
}
