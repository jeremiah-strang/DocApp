import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

import Colors from '../style/Colors'

export default class DocTemplateItem extends React.Component {
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
        <FontAwesome style={styles.itemIcon} name='file-pdf-o' size={36} color={Colors.Theme1} />
        <View style={styles.flexColumn}>
          <TouchableHighlight onPress={this.props.onOpenDocTemplate}>
            <Text numberOfLines={1} style={styles.itemName}>{this.props.docTemplate.name}</Text>
          </TouchableHighlight>
          <View style={styles.flexRow}>
            <Text style={{ color: Colors.Gray7 }}>Created by&nbsp;</Text>
            <Text style={styles.itemCreatedBy}>{this.props.docTemplate.createdBy}</Text>
            <Text style={{ color: Colors.Gray7 }}>&nbsp;on&nbsp;</Text>
            <Text style={{ color: Colors.Gray7 }}>{createdOnText}</Text>
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
    borderColor: Colors.Gray7,
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
    color: Colors.Theme1,
    fontSize: 22,
    marginBottom: 4,
    flex: 1,
    paddingRight: 10,
  },
  itemCreatedBy: {
    color: Colors.Theme1,
  },
  itemIcon: {
    alignItems: 'center',
    width: 40,
    justifyContent: 'center',
  },
})
