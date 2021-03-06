import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View } from 'react-native'

import Colors from '../style/Colors'

export default class DocFieldText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.docField.defaultValue,
    }
  }

  render() {
    return (
      <View style={styles.docField}>
        <Text style={styles.docFieldName}>{this.props.docField.name}</Text>
        <TextInput style={styles.textInput}
                   onChangeText={(value) => this.setState({value})}
                   value={this.state.value} />
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
