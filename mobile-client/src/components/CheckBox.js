import React from 'react'
import {
  Button,
  DatePickerIOS,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

import Colors from '../style/Colors'

export default class CheckBox extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  onToggle() {
    this.props.onPress(!this.props.isChecked)
    this.setState(previousState => { isChecked: !previousState.isChecked })
  }

  render() {
    let labelStyle
    if (this.props.labelColor) {
      labelStyle = StyleSheet.flatten([styles.checkBoxLabel, {color: this.props.labelColor}])
    } else {
      labelStyle = styles.checkBoxLabel
    }

    let iconWrap
    if (this.props.isChecked === true) {
      iconWrap = (
        <TouchableWithoutFeedback onPress={this.onToggle.bind(this)}>
          <View style={styles.checkBoxIconWrap}>
            <FontAwesome style={styles.checkBoxIcon} name='check' size={20} />
          </View>
        </TouchableWithoutFeedback>
      )
    } else {
      iconWrap =  (
        <TouchableWithoutFeedback onPress={this.onToggle.bind(this)}>
          <View style={styles.checkBoxIconWrap}></View>
        </TouchableWithoutFeedback>
      )
    }

    return (
      <View style={this.props.style}>
        <View style={styles.checkBoxWrap}>
          {iconWrap}
          <TouchableWithoutFeedback onPress={this.onToggle.bind(this)}>
            <View>
              <Text style={labelStyle}>{this.props.label}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  checkBoxWrap: {
    flexDirection: 'row',
  },
  checkBoxIcon: {
    color: Colors.Dark1,
  },
  checkBoxIconWrap: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: Colors.Dark1,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  checkBoxLabel: {
    alignItems: 'center',
    color: Colors.Dark1,
    flex: 1,
    fontSize: 16,
    paddingTop: 4,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 4,
  },
})
