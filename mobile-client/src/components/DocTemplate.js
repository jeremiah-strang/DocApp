import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  ScrollView,
  View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import DocFieldText from './DocFieldText'
import DocFieldNumber from './DocFieldNumber'
import DocFieldPhone from './DocFieldPhone'

import Colors from '../style/Colors'

export default class DocTemplate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    let docTemplate = this.props.docTemplate
    let docFieldItems
    if (docTemplate && Array.isArray(docTemplate.docFields)) {
      docFieldItems = docTemplate.docFields.map(df => {
        switch (df.type) {
          case 'number':
            return <DocFieldNumber key={df.uuid} docField={df}></DocFieldNumber>
          case 'phone':
            return <DocFieldPhone key={df.uuid} docField={df}></DocFieldPhone>
          case 'text':
          default:
            return <DocFieldText key={df.uuid} docField={df}></DocFieldText>
        }
      })
    } else {
      docFieldItems = []
    }
    return (
      <ScrollView style={styles.docTemplateItem}>
        <Text style={styles.headerText}>{this.props.docTemplate.name}</Text>
        {docFieldItems}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  headerText: {
    color: Colors.Dark1,
    fontSize: 22,
    marginBottom: 8,
    paddingRight: 10,
    paddingLeft: 10,
  },
})
