import React from 'react'
import {
  Button,
  DatePickerIOS,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

import Colors from '../style/Colors'

export default class CheckBox extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isChecked: this.props.isChecked === true
    }
  }

  render() {
    let labelStyle
    if (this.props.labelColor) {
      labelStyle = StyleSheet.flatten([styles.checkBoxLabel, {color: this.props.labelColor}])
    } else {
      labelStyle = styles.checkBoxLabel
    }

    let iconWrap
    if (this.state.isChecked === true) {
      iconWrap = <View style={styles.checkBoxIconWrap}>
                   <FontAwesome style={styles.checkBoxIcon} name='check' size={20} />
                 </View>
    } else {
      iconWrap = <View style={styles.checkBoxIconWrap}></View>
    }

    return (
      <View style={this.props.style}>
        <View style={styles.checkBoxWrap}>
          {iconWrap}
          <TouchableHighlight onPress={() => {
              console.log('highlight clicked')
              this.props.onPress()
            }}>
              <Text style={labelStyle}>{this.props.label}</Text>
          </TouchableHighlight>
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
