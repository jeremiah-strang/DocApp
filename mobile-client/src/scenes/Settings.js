import React from 'react'
import { Button, StyleSheet, Text, TextInput, ScrollView, View } from 'react-native'

import Colors from '../style/Colors'

export default class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.headerText}>Settings</Text>
        <Button onPress={this.props.onLogOut} title={'Sign out'}>Sign out</Button>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  headerText: {
    color: Colors.Dark1,
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
