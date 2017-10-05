import React from 'react'
import { Button, StyleSheet, Text, TextInput, ScrollView, View } from 'react-native'

export default class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.logoText}>Settings</Text>
        <Button onPress={this.props.onLogOut} title={'Sign out'}>Sign out</Button>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  logoText: {
    color: '#028bdd',
    fontSize: 60,
    marginBottom: 40,
  },
  container: {
    flexDirection: 'column',
    flex: 1,
  },
})
