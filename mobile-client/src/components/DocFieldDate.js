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

import Colors from '../style/Colors'

export default class DocFieldDate extends React.Component {
  constructor(props) {
    super(props)

    let now = new Date()
    let MM = now.getMonth() + 1
    let yyyy = now.getFullYear()
    let dd = now.getDate()
    let value = this.props.docField.dateFormat
    if (value) {
      value = value.replace('yyyy', yyyy)
      value = value.replace('MM', MM)
      value = value.replace('dd', dd)
    }

    this.state = {
      value: Platform.OS === 'ios' ? now : value,
    }
  }

  render() {
    let datePicker
    switch (Platform.OS) {
      case 'ios':
        datePicker = <DatePickerIOS date={this.state.value}
                                    mode='date'
                                    onDateChange={(value) => this.setState({value})}/>
        break
      case 'android':
      default:
        datePicker = <TextInput style={styles.textInput}
                                onChangeText={(value) => this.setState({value})}
                                value={this.state.value} />
        break

    }

    return (
      <View style={styles.docField}>
        <Text style={styles.docFieldName}>{this.props.docField.name}</Text>
        {datePicker}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  docField: {
    width: '100%',
    marginBottom: 8,
    backgroundColor: '#fff',
    borderColor: Colors.Gray7,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 10,
    flexDirection: 'column',
  },
  docFieldName: {
    color: Colors.Dark1,
    marginBottom: 8,
  },
  textInput: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: Colors.Dark1,
    borderRadius: 8,
    borderWidth: 1,
    color: Colors.Dark1,
    fontSize: 15,
    height: 42,
    padding: 4,
  },
})
