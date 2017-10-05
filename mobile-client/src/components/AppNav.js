import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import Home from './Home'
import Docs from './Docs'
import Settings from './Settings'

export default class AppNav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentView: 'Home',
    }
  }

  render() {
    let currentView
    let homeStyles = [styles.navBarButton]
    let docsStyles = [styles.navBarButton]
    let settingsStyles = [styles.navBarButton]
    switch (this.state.currentView) {
      case 'Docs':
        currentView = <Docs></Docs>
        docsStyles.push(styles.activeNavBarButton)
        break
      case 'Settings':
        currentView = <Settings onLogOut={() => { this.props.onLogOut()}}></Settings>
        settingsStyles.push(styles.activeNavBarButton)
        break
      case 'Home':
      default:
        currentView = <Home></Home>
        homeStyles.push(styles.activeNavBarButton)
        break
    }

    return (
      <View style={styles.container}>
        <View style={styles.currentView}>
          {currentView}
        </View>
        <View style={styles.navBar}>
          <TouchableHighlight style={homeStyles} onPress={() => {this.setState({ currentView: 'Home' })}}>
            <Ionicons name='md-home' size={36} color='#028bdd' />
          </TouchableHighlight>
          <TouchableHighlight style={docsStyles} onPress={() => { this.setState({ currentView: 'Docs' })}}>
            <Ionicons name='md-folder' size={36} color='#028bdd' />
          </TouchableHighlight>
          <TouchableHighlight style={settingsStyles} onPress={() => { this.setState({ currentView: 'Settings' })}}>
            <Ionicons name='md-settings' size={36} color='#028bdd' />
          </TouchableHighlight>
        </View>
      </View>
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
  currentView: {
    backgroundColor: '#e1e1e1',
    flex: 1,
    width: '100%',
    paddingTop: 20,
  },
  navBar: {
    flexDirection: 'row',
  },
  navBarButton: {
    alignItems: 'center',
    backgroundColor: '#333',
    flex: 1,
    height: 60,
    justifyContent: 'center',
  },
  activeNavBarButton: {
    backgroundColor: '#4d4d4d',
  },
})
