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
import DocTemplate from './DocTemplate'
import DocTemplateItem from './DocTemplateItem'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      docTemplate: null,
    }
  }

  render() {
    let docTemplateData = [
      {
        id: 30,
        name: 'Interior painting estimate form 2',
        createdBy: 'jstrang', 
        createdOn: new Date(2017, 8, 20),
      },
      {
        id: 29,
        name: 'Interior painting estimate form 1',
        createdBy: 'bsmith', 
        createdOn: new Date(2017, 8, 18),
      },
      {
        id: 28,
        name: 'Exterior & interior painting estimate form',
        createdBy: 'bsmith', 
        createdOn: new Date(2017, 8, 4),
      },
      {
        id: 27,
        name: 'Customer invoice (basic)',
        createdBy: 'jstrang', 
        createdOn: new Date(2017, 8, 4),
      },
      {
        id: 26,
        name: 'Customer invoice (for jobs in Colorado)',
        createdBy: 'bsmith', 
        createdOn: new Date(2017, 8, 3),
      },
      {
        id: 25,
        name: 'Liability contract 2',
        createdBy: 'gjones', 
        createdOn: new Date(2017, 8, 3),
      },
      {
        id: 24,
        name: 'Liability contract 1',
        createdBy: 'gjones', 
        createdOn: new Date(2017, 8, 3),
      },
    ]

    let docTemplateItems = docTemplateData.map(docTemplate => {
      return <DocTemplateItem docTemplate={docTemplate}
                              onOpenDocTemplate={() => this.setState({docTemplate})}
                              key={docTemplate.id}></DocTemplateItem>
     })

    if (!this.state.docTemplate) {
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
    } else {
      return <DocTemplate docTemplate={this.state.docTemplate}></DocTemplate>
    }
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
  searchWrap: {
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
