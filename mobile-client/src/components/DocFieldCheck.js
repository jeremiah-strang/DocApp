import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View } from 'react-native'

import CheckBox from '../components/CheckBox'
import Colors from '../style/Colors'

export default class DocFieldText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.docField.defaultValue === true,
    }
  }

  onToggle(isChecked) {
    this.setState({ value: isChecked })
  }

  render() {
    return (
      <View style={styles.docField}>
        <CheckBox style={styles.checkBox}
                  isChecked={this.state.value}
                  onPress={this.onToggle.bind(this)}
                  label={this.props.docField.name} />
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
