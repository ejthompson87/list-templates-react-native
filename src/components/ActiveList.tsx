import React from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  View,
  TouchableNativeFeedback,
  SafeAreaView,
  LogBox
} from 'react-native';
import { ActiveListModel } from "../models/ActiveListModel";
import { ActiveListItemModel } from "../models/ActiveListItemModel";
import ActiveListItem from "./ActiveListItem";
import { Ionicons } from '@expo/vector-icons';

interface ActiveListProps {
  list: ActiveListModel;
  newAtTop: boolean;
  showChecked: boolean;
  onChange(list: ActiveListItemModel[]): void;
}

export default class ActiveList extends React.Component<ActiveListProps, { autoFocus: boolean }> {
  newItemList: ActiveListItemModel;

  constructor(props: ActiveListProps) {
    super(props);
    this.state = {
      autoFocus: false,
    };
    if (props.onChange == null) props.onChange = () => {};

    this.newItemList = { 
      text: "",
      checked: false,
      key: "1"
    };
  }

  addItem() {
    this.setState({autoFocus: true});
    console.log("Props: ", this.props)
    let list = this.props.list.items;
    let itemTemplate = this.newItemList;
    let newItemList = [];
    if (this.props.newAtTop) {
      newItemList = [
        { key: new Date().getTime().toString(), text: itemTemplate.text, checked: false },
        ...list.slice(0)
      ]
    } else {
      newItemList = list.concat({ key: new Date().getTime().toString(), text: itemTemplate.text, checked: false });
    }
    this.props.onChange(newItemList);
  }
  
  onChecked = (index: number) => {
    let newList = this.updateListElement(this.props.list.items, index, (old: ActiveListItemModel) => {
      return {...old, checked: !old.checked}
    });
    this.props.onChange(newList);
  }
  
  // editFunc MUST return a new element and not mutate the old element
  updateListElement = (list: ActiveListItemModel[], index: number, editFunc: any) => {
    if (list[index].checked === false){
      return [
        ...list.slice(0,index),
        ...list.slice(index+1),
        editFunc(list[index]),
      ]
    }
    return [
      ...list.slice(0,index),
      editFunc(list[index]),
      ...list.slice(index+1),
    ]
  }
  
  onDelete = (item: ActiveListItemModel) => {
    let filteredList = this.props.list.items.filter((listitem) => listitem.key !== item.key);
    this.props.onChange(filteredList);
  }
  
  onTextChange = (index: number, text: string) => {
    console.log('text change: ', text)
    let newList = this.updateListElement(this.props.list.items, index, (old: ActiveListItemModel) => {
      return {...old, text: text}
    });
    this.props.onChange(newList);
  }
  
  onTextBlur = (item: ActiveListItemModel) => {
    if (item.text === '') {
      this.onDelete(item);
    }
    this.setState({autoFocus: false});
  }

  render() {
    if (this.props.list!=null && this.props.list.items!=null) {
      return (
        <View style={[styles.container, styles.activeListBorder]}>
          <SafeAreaView style={{flex: 1}}>
            <FlatList
                data={this.props.list.items}
                removeClippedSubviews={false}
                extraData={this.props}
                renderItem={({ item, index }) => {
                  if (!item.checked || (item.checked && this.props.showChecked)) {
                    return (
                      <View> 
                        <ActiveListItem 
                          index={index} 
                          listItem={item} 
                          delete={this.onDelete} 
                          checked={this.onChecked} 
                          updateText={this.onTextChange}
                          textBlur={this.onTextBlur}
                          autoFocus={this.state.autoFocus}
                        >
                        </ActiveListItem>
                      </View>
                    )
                  } return null;
              }} 
            />
          </SafeAreaView>    

          <View style={styles.addButtonInner}>
            <TouchableNativeFeedback
                onPress={() => this.addItem()}
                background={TouchableNativeFeedback.SelectableBackground()}>
                  <View style={styles.addButtonPosition}>
                    <Ionicons
                      name={'add-circle'}
                      size={55}
                      color={'#19647E'}
                    />
                  </View>
            </TouchableNativeFeedback>        
          </View>

        </View>
      );
    } else {
      return(
        <View style={styles.addButtonInner}>
          <TouchableNativeFeedback
              onPress={() => this.addItem()}
              background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={styles.addButtonPosition}>
                  <Ionicons
                      name={'add-circle'}
                      size={55}
                      color={'#19647E'}
                    />
                </View>
          </TouchableNativeFeedback>        
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  activeListBorder: {
    borderColor: '#19647E',
    borderTopWidth: 8,
  },
  listItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 5,
  },
  addButtonInner: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    height: 90,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addButtonPosition: {
    paddingHorizontal: 17,
    paddingVertical: 12,
    marginRight: 10
  },
});