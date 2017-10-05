import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default class DocFieldNumber extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <View style={styles.docField}>
        <Text style={styles.docFieldName}>{this.props.docField.name}</Text>
        <TextInput style={styles.textInput}
                   keyboardType={'numeric'}
                   value={this.props.docField.defaultValue} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  docField: {
    width: '100%',
    marginBottom: 8,
    backgroundColor: '#fff',
    borderColor: '#a6a6a6',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 10,
    flexDirection: 'column',
  },
  docFieldName: {
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    width: '50%',
    backgroundColor: '#fff',
    borderColor: '#333',
    borderRadius: 8,
    borderWidth: 1,
    color: '#333',
    fontSize: 15,
    height: 42,
    padding: 4,
  },
})
