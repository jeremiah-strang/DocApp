import React from 'react'
import { 
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  ScrollView,
  View } from 'react-native'

import DocTemplate from '../components/DocTemplate'
import DocTemplateItem from '../components/DocTemplateItem'

import api from '../data/api'
import Colors from '../style/Colors'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      docTemplate: null,
      docTemplates: [],
    }
  }

  componentDidMount() {
    api.getDocTemplates().then(docTemplates => this.setState({ docTemplates }))
  }

  loadDocTemplate(docTemplate) {
    if (docTemplate) {
      api.getDocTemplate(docTemplate.id).then(docTemplate => this.setState({ docTemplate }))
    }
  }

  render() {
    let docTemplateItems = this.state.docTemplates.map(docTemplate => {
      return <DocTemplateItem docTemplate={docTemplate}
                              onOpenDocTemplate={() => {
                                this.loadDocTemplate(docTemplate)
                              }}
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
    color: Colors.Dark1,
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
    borderColor: Colors.Dark1,
    borderRadius: 8,
    borderWidth: 1,
    color: Colors.Dark1,
    flex: 1,
    fontSize: 15,
    height: 42,
    marginBottom: 8,
    padding: 4,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: Colors.Dark3,
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
    borderColor: Colors.Dark10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 15,
  },
  docTemplateItemText: {
    color: Colors.Theme1,
    fontSize: 22,
    marginBottom: 8,
  },
})
