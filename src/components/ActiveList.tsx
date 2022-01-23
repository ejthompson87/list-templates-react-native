import React from "react";
import { ActiveListModel } from "../models/ActiveListModel";
import { ActiveListItemModel } from "../models/ActiveListItemModel";

interface ActiveListProps {
  list: ActiveListModel;
  newAtTop: boolean;
  showChecked: boolean;
  onChange(list: ActiveListItemModel[]): void;
}

export default class ActiveList extends React.Component<ActiveListProps> {
  newItemList: ActiveListItemModel;

  constructor(props: any) {
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

}