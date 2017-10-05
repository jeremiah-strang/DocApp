import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default class AppNav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <View style={styles.docTemplateItem}>
        <Ionicons style={styles.itemIcon} name='md-document' size={40} color='#028bdd' />
        <View style={styles.vertTextWrap}>
          <TouchableHighlight>
            <Text style={styles.itemName}>{this.props.docTemplateName}</Text>
          </TouchableHighlight>
          <TouchableHighlight>
            <Text style={styles.itemCreatedBy}>{this.props.createdBy}</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  docTemplateItem: {
    width: '100%',
    marginBottom: 8,
    backgroundColor: '#fff',
    borderColor: '#a6a6a6',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 10,
    flexDirection: 'row',
  },
  vertTextWrap: {
    flexDirection: 'column',
  },
  itemName: {
    color: '#028bdd',
    fontSize: 22,
    marginBottom: 4,
    flex: 1,
  },
  itemCreatedBy: {
    color: '#028bdd',
    fontSize: 15,
    flex: 1,
    marginBottom: 4,
  },
  itemIcon: {
    alignItems: 'center',
    width: 40,
    justifyContent: 'center',
  },
})
