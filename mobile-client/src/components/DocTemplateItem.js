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
    let MM = this.props.docTemplate.createdOn.getMonth() + 1
    let dd = this.props.docTemplate.createdOn.getDate()
    let yyyy = this.props.docTemplate.createdOn.getFullYear()
    let createdOnText = '' + MM + '/' + dd + '/' + yyyy
    return (
      <View style={styles.docTemplateItem}>
        <Ionicons style={styles.itemIcon} name='md-document' size={40} color='#028bdd' />
        <View style={styles.flexColumn}>
          <TouchableHighlight>
            <Text numberOfLines={1} style={styles.itemName}>{this.props.docTemplate.name}</Text>
          </TouchableHighlight>
          <View style={styles.flexRow}>
            <Text style={{ color: '#aaa' }}>Created by&nbsp;</Text>
            <Text style={styles.itemCreatedBy}>{this.props.docTemplate.createdBy}</Text>
            <Text style={{ color: '#aaa' }}>&nbsp;on&nbsp;</Text>
            <Text style={{ color: '#aaa' }}>{createdOnText}</Text>
          </View>
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
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  itemName: {
    color: '#028bdd',
    fontSize: 22,
    marginBottom: 4,
    flex: 1,
    paddingRight: 10,
  },
  itemCreatedBy: {
    color: '#028bdd',
  },
  itemIcon: {
    alignItems: 'center',
    width: 40,
    justifyContent: 'center',
  },
})
