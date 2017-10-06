import numeral from 'numeral'
import uuidv4 from 'uuid/v4'
import XDate from 'xdate'

import utils from '../utils/utils'
import DocFieldType from '../models/DocFieldType'

/**
 *
 */
export default class {

  /**
   *
   */
  constructor (opts, sharedProps) {
    this.uuid = uuidv4()
    this.type = opts.type
    this.x = opts.x
    this.y = opts.y
    this.height = opts.height
    this.isSelected = opts.isSelected === true
    this.isRequired = opts.isRequired === true
    this.snapLineX = opts.snapLineX
    this.snapLineY = opts.snapLineY
    this.text = opts.text

    if (typeof opts.name !== 'string' || opts.name.length === 0) {
      this.name = utils.capitalizeWord(this.type) + ' Field ' + sharedProps.count
    } else {
      this.name = opts.name
    }

    if (typeof sharedProps === 'object') {
      this.fontSize = opts.fontSize || sharedProps.fontSize
      this.fontFamily = opts.fontFamily || sharedProps.fontFamily
      this.numberFormat = opts.numberFormat || sharedProps.numberFormat
      this.dateFormat = opts.dateFormat || sharedProps.dateFormat
      this.width = opts.width || sharedProps.width
    }
    this.updateText()
  }

  /**
   *
   */
  getCleanedJson () {
    return {
      uuid: this.uuid,
      name: this.name,
      type: this.type,
      x: this.x,
      y: this.y,
      height: this.height,
      isRequired: this.isRequired,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      numberFormat: this.numberFormat,
      dateFormat: this.dateFormat,
      width: this.width,
    }
  }

  /**
   *
   */
  updateText () {
    switch (this.type) {
      case DocFieldType.text:
        this.text = 'Example text'
        break
      case DocFieldType.number:
        let num = 12345.67
        this.text = this.numberFormat ? numeral(num).format(this.numberFormat) : num
        break
      case DocFieldType.date:
        let dateStr = (new XDate(2017, 0, 1)).toString(this.dateFormat)
        this.text = dateStr
        break
      case DocFieldType.phone:
        this.text = '555-555-1234'
        break
      case DocFieldType.drawing:
        this.text = 'Signature/Drawing'
        break
      case DocFieldType.check:
      case DocFieldType.checkx:
      case DocFieldType.checksq:
        this.text = ' '
        break
    }
  }

  /**
   *
   */
  moveY (px, snapLines) {
    let newY = this.y + px
    if (newY >= 0 && newY + this.height <= 1100) {
      this.y = newY
      if (this.snapLineY) {
        this.snapLineY.isSelected = false
      }

      let snapLineY = snapLines.find(sn => {
        return sn.position === this.y
      })

      this.snapLineY = snapLineY

      if (this.snapLineY) {
        this.snapLineY.isSelected = true
      }
    }
  }

  /**
   *
   */
  moveX (px, snapLines) {
    let newX = this.x + px
    if (newX >= 0 && newX < 830) {
      this.x = newX
      if (this.snapLineX) {
        this.snapLineX.isSelected = false
      }

      let snapLineX = snapLines.find(sn => {
        return sn.position === this.x
      })

      this.snapLineX = snapLineX

      if (this.snapLineX) {
        this.snapLineX.isSelected = true
      }
    }
  }
}
