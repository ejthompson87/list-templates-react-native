import React from 'react';
import { 
  View, 
  Text, 
  TouchableHighlight,
  TouchableNativeFeedback,
  FlatList,
  StyleSheet,
} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Storage from '../services/StorageService';
import { ActiveListModel } from '../models/ActiveListModel';
import { TemplateModel } from '../models/TemplateModel';
import { Ionicons } from '@expo/vector-icons';
import { FindWithAttr, UpdateListElement } from '../functions/CommonFunctions';
import { TemplateItemModel } from '../models/TemplateItemModel';
import { ActiveListItemModel } from '../models/ActiveListItemModel';

export interface ActiveListScreenProps {
  navigation: any,
}

export interface ActiveListScreenInitialState {
  activeLists: ActiveListModel[],
  modalVisible: boolean, 
  selectedList: ActiveListModel | null,
  templateLists: TemplateModel[],
  templatesLoading: boolean,
  showChecked: boolean,
  newAtTop: boolean,
  navigation: any,
}

export default class ActiveListsScreen extends React.Component<ActiveListScreenProps, ActiveListScreenInitialState> {
  didFocusSubscription: any;

  constructor(props: ActiveListScreenProps) {
    super(props);
    this.state = {
      activeLists: [], 
      modalVisible: false, 
      selectedList: null, 
      templateLists: [],
      templatesLoading: false,
      showChecked: true,
      newAtTop: true,
      navigation: null,
    };
    this.didFocusSubscription = null;
  }

  // savedActiveLists holds array of listIds
  // savedActiveList holds activeList obj

  async componentDidMount() {
    let data = await Storage.getLists('activeLists');
    let templates = await Storage.getLists('templateLists');
    this.setState({activeLists: data, modalVisible: false, selectedList: null, templateLists: templates});

    this.didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      async () => {
        let lists = await Storage.getLists('activeLists');
        this.setState({activeLists: lists});
      }
    );
  }

  // componentWillUnmount() {
  //   this.didFocusSubscription.remove();
  // }
  
  _onPressAddList() {
    let newList = {"id": new Date().getTime().toString(), title: "✈️ New list", items: []};
    this.getTemplates();
    this.setState({ selectedList: newList, templatesLoading: true });
    this.props.navigation.navigate('EditActiveListScreen', {
      key: newList.id,
      list: newList,
      editTitle: 'Add Active List',
      showTemplates: this.state.templateLists.length > 0,
      templates: this.state.templateLists,
      templateLoading: this.state.templatesLoading,
      listPrimaryColor: '#19647E',
      submit: this.onSave,
      delete: this.onDelete,
      navigation: this.props.navigation,
    });
  }

  _editList = (item: ActiveListModel) => {
    this.setState({ selectedList: item, templatesLoading: true });
    this.getTemplates();
    this.props.navigation.navigate('EditActiveListsScreen', {
      key: item.id,
      list: item,
      editTitle: 'Edit Active List',
      showTemplates: false,
      listPrimaryColor: '#19647E',
      submit: this.onSave,
      delete: this.onDelete,
      navigation: this.props.navigation,
    });
    // this.onSetModalVisible(true);
  }

  onSetModalVisible = (visible: boolean) => {
    this.setState({ modalVisible: visible });
  }

  onTemplateSelected = (list: ActiveListModel, index: number) => {
    let activeListIndex = FindWithAttr(this.state.activeLists, 'id', list.id);
    if (activeListIndex > -1) {
      let updatedlists = UpdateListElement(this.state.activeLists, activeListIndex, (rest: any) => {
        return {...rest, template: this.state.templateLists[index], items: this.state.templateLists[index].items}
      });
      this.setState({activeLists: updatedlists});
      Storage.saveLists(updatedlists, 'activeLists');
    }
  }

  getTemplateIndex(templateId: string) {
    if (templateId != null) {
      for (let i=0; i<this.state.templateLists.length; i++) {
        if (this.state.templateLists[i].id === templateId) {
          return i;
        }
      }
    }
    return -1;
  }
  
  async getTemplates() {
    let templates = await Storage.getLists('templateLists');
    this.setState({templateLists: templates, templatesLoading: false});
  } 

  onUpdateTitle = (id: string, text: string) => {
    let index = FindWithAttr(this.state.activeLists, 'id', id);
    if (index > -1) {
      let updatedlists = UpdateListElement(this.state.activeLists, index, (rest: any) => {
        return {...rest, title: text}
      });
      this.setState({activeLists: updatedlists, selectedList: updatedlists[index]})
      Storage.saveLists(updatedlists, 'activeLists');
    }
  }

  onDelete = (list: ActiveListModel) => {
    let filteredLists = this.state.activeLists.filter((activeList) => activeList.id !== list.id);
    this.setState({activeLists: filteredLists});
    Storage.saveLists(filteredLists, 'activeLists');
  }

  setItemsDefaultChecked(listItems: TemplateItemModel[]): ActiveListItemModel[] {
    return listItems.map(item => {
      return {
        key: item.key,
        text: item.text,
        checked: false,
      }
    });
  }

  onSave = (list: ActiveListModel, selectedTemplateIndex = -1) => {
    if (selectedTemplateIndex > -1) {
      list.items = this.setItemsDefaultChecked(this.state.templateLists[selectedTemplateIndex].items);
    }
    let activeListIndex = FindWithAttr(this.state.activeLists, 'id', list.id);
    let updateLists = this.state.activeLists;
    if (activeListIndex > -1) {
      updateLists[activeListIndex] = list;
    }
    else {
      updateLists.push(list);
    }
    this.setState({activeLists: updateLists});
    Storage.saveLists(updateLists, 'activeLists');
  }

  onSaveAsTemplate = (list: ActiveListModel) => {
    this.getTemplates();
    list.id = new Date().getTime().toString();
    for (let item of list.items) {
      item.checked = false;
    }
    let existingTemplates = this.state.templateLists;
    let allTemplates = [...existingTemplates, list];
    this.setState({templateLists: allTemplates});
    Storage.saveLists(allTemplates, 'templateLists');
    this.props.navigation.navigate('TemplatesStack');

    // this.props.navigation.navigate(NavigationActions.navigate({
    //   routeName: 'TemplatesStack',
    //   action: NavigationActions.navigate({ routeName: 'TemplatesScreen'})
    // }));
  }

  onShowChecked = () => {
    this.setState({showChecked: !this.state.showChecked});
  }

  onNewAtTop = () => {
    this.setState({newAtTop: !this.state.newAtTop});
  }

  async _onPressDeleteAllLists() {
    await Storage.deleteLists('activeLists');
    this.setState({activeLists: []});
  } 

  render() {
    const {navigate} = this.props.navigation;

    return (
      <View style={styles.container}>
        <FlatList
            data={this.state.activeLists}
            // Pass any dependencies so that this PureComponent will know when to re-render
            keyExtractor={(item, index) => item.id}
            renderItem={ ({item, index}) => (
              <TouchableHighlight
                onPress={() => navigate('EditActiveListScreen', {
                  id: item.id, 
                  title: item.title, 
                  saveAsTemplate: this.onSaveAsTemplate, 
                  showChecked: this.state.showChecked, 
                  onShowChecked: this.onShowChecked, 
                  newAtTop: this.state.newAtTop,
                  onNewAtTop: this.onNewAtTop,
                  edit: this._editList,
                  navigation: navigate,
                })}
                onLongPress={() => this._editList(item)}
              >

                <View style={styles.listItem}>
                  <Text style={styles.itemContainer}>{item.title}</Text>
                </View>
              </TouchableHighlight>

            )}
          />

          <View style={styles.addButtonInner}>
            <TouchableNativeFeedback
                onPress={() => this._onPressAddList()}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={styles.addButtonBorder}>
                  <Ionicons
                    name={'md-add'}
                    size={26}
                    color={'white'}
                  />
              </View>
            </TouchableNativeFeedback>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addButtonInner: {
    position: 'absolute',
    bottom: 10,
    right: 5,
    height: 70,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addButtonBorder: {
    paddingHorizontal: 17,
    paddingVertical: 12,
    borderRadius: 50,
    backgroundColor: '#19647E',
    marginRight: 25
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    fontSize: 20,
    marginLeft: 20, 
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
  },
  deleteContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 28,
    marginBottom: 5
  }
});

// export default function ActiveListsScreen(navigation: any) {

  // return (
  //   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //     <Text>Active Lists Screen</Text>
  //     <Button
  //       title="Go to Details"
  //       onPress={() => navigation.navigate('Details')}
  //     />
  //   </View>
  // )
// }