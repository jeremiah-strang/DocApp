import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import CheckBox from 'react-native-check-box'
import Login from './src/scenes/Login'
import AppNav from './src/scenes/AppNav'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: true
    }
  }

  render() {
    if (this.state.isLoggedIn) {
      return <AppNav onLogOut={() => { this.setState({ isLoggedIn: false })}}></AppNav>
    } else {
      return <Login onLogIn={() => { this.setState({ isLoggedIn: true })}}></Login>
    }
  }
}
