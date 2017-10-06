import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import CheckBox from 'react-native-check-box'

import Colors from '../style/Colors'

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      keepLoggedIn: true,
    }
  }

  signIn() {
    let isAuthenticated = true
    if (isAuthenticated === true) {
      this.props.onLogIn()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.logoText}>DocApp</Text>
        <TextInput style={styles.textInput}
                   onChangeText={(username) => this.setState({username})}
                   value={this.state.username}
                   placeholder={'Username'} />
        <TextInput style={styles.textInput}
                   onChangeText={(password) => this.setState({password})}
                   value={this.state.password}
                   secureTextEntry={true}
                   placeholder={'Password'} />
        <CheckBox style={styles.checkBox}
                  isChecked={this.state.keepLoggedIn}
                  onClick={() => this.setState(previousState => {
                    return { keepLoggedIn: !previousState.keepLoggedIn };
                  })} />
        <Text style={styles.checkBoxText}>
            &nbsp;&nbsp;Keep me signed in
          </Text>
        <View style={styles.buttonContainer}>
          <Button onPress={this.signIn.bind(this)}
                  title='Sign In'
                  color={Colors.Theme1} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.Dark3,
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoText: {
    color: Colors.Theme1,
    fontSize: 60,
    marginBottom: 40,
  },
  textInput: {
    backgroundColor: '#fff',
    borderColor: Colors.Dark1,
    borderRadius: 8,
    borderWidth: 1,
    color: Colors.Dark1,
    fontSize: 15,
    marginBottom: 12,
    padding: 12,
    width: '100%',
  },
  checkBox: {
    backgroundColor: Colors.Dark3,
    height: 20,
    width: 20,
  },
  checkBoxText: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 12,
  },
  buttonContainer: {
    width: '100%',
    backgroundColor: Colors.Dark1,
    borderRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    borderColor: Colors.Dark3,
    borderWidth: 1,
  },
})
