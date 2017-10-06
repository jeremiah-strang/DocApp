import React from 'react'
import { Button, StyleSheet, Text, TextInput, ScrollView, View } from 'react-native'

export default class Docs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.headerText}>Docs</Text>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  headerText: {
    color: '#333',
    fontSize: 22,
    marginBottom: 8,
    paddingRight: 10,
    paddingLeft: 10,
  },
  container: {
    flexDirection: 'column',
    flex: 1,
  },
})
