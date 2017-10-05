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
import DocTemplateItem from './DocTemplateItem'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
    }
  }

  render() {
    let docTemplateItems = []

    for (let i = 1; i <= 20; i++) {
      docTemplateItems.push(
        <DocTemplateItem docTemplateName={'Doc Template ' + i}
                         createdBy={'jstrang'}
                         key={i}></DocTemplateItem>
      )
    }

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.headerText}>Available Document Templates</Text>
        <View style={styles.searchWrap}>
          <TextInput style={styles.textInput}
                     onChangeText={(searchText) => this.setState({searchText})}
                     value={this.state.searchText}
                     placeholder={'Search'} />
        </View>
        {docTemplateItems}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 10,
  },
  headerText: {
    color: '#028bdd',
    fontSize: 22,
    marginBottom: 8,
    paddingRight: 10,
    paddingLeft: 10,
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 15,
    paddingLeft: 15,
  },
  textInput: {
    backgroundColor: '#fff',
    borderColor: '#333',
    borderRadius: 8,
    borderWidth: 1,
    color: '#333',
    flex: 1,
    fontSize: 15,
    height: 42,
    marginBottom: 8,
    padding: 4,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: '#4d4d4d',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    marginLeft: 8,
    width: 50,
  },
  docTemplateItem: {
    width: '100%',
    marginBottom: 8,
    backgroundColor: '#fff',
    borderColor: '#a6a6a6',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 15,
  },
  docTemplateItemText: {
    color: '#028bdd',
    fontSize: 22,
    marginBottom: 8,
  },
})
