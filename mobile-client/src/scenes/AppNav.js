import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View } from 'react-native'
import { Ionicons, FontAwesome } from '@expo/vector-icons'

import Home from './Home'
import Docs from './Docs'
import Settings from './Settings'

import Colors from '../style/Colors'

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
    let docTemplateStyles = [styles.navBarButton]
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
        <View style={{ width: '100%', height: 24, backgroundColor: '#fff' }}></View>
        <View style={{ width: '100%', height: 5, backgroundColor: Colors.Theme1 }}></View>
        <View style={styles.currentView}>
          {currentView}
        </View>
        <View style={styles.navBar}>
          <TouchableHighlight style={homeStyles}
                              onPress={() => {this.setState({ currentView: 'Home' })}}>
            <Ionicons name='md-home' size={36} color={Colors.Theme1} />
          </TouchableHighlight>
          <TouchableHighlight style={docsStyles} onPress={() => { this.setState({ currentView: 'Docs' })}}>
            <FontAwesome name='files-o' size={32} color={Colors.Theme1} />
          </TouchableHighlight>
          <TouchableHighlight style={settingsStyles} onPress={() => { this.setState({ currentView: 'Settings' })}}>
            <FontAwesome name='cog' size={36} color={Colors.Theme1} />
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  logoText: {
    color: Colors.Theme1,
    fontSize: 60,
    marginBottom: 40,
  },
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  currentView: {
    backgroundColor: Colors.Gray3,
    flex: 1,
    width: '100%',
    paddingTop: 15,
  },
  navBar: {
    flexDirection: 'row',
  },
  navBarButton: {
    alignItems: 'center',
    backgroundColor: Colors.Dark1,
    flex: 1,
    height: 60,
    justifyContent: 'center',
  },
  activeNavBarButton: {
    backgroundColor: Colors.Dark3,
  },
})
