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
        return <Text style={{ color: '#333' }} key={df.uuid}>{df.name}</Text>
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
    color: '#333',
    fontSize: 22,
    marginBottom: 8,
    paddingRight: 10,
    paddingLeft: 10,
  },
})
