import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import * as Storage from '../services/StorageService';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import ActiveList from '../components/ActiveList';
import { ActiveListModel } from '../models/ActiveListModel';
import { ActiveListItemModel } from '../models/ActiveListItemModel';
import Icon from 'react-native-vector-icons/Ionicons';

export interface EditActiveListScreenProps {
    navigation: any,
    route: any,
}

export default class EditActiveListScreen extends React.Component<EditActiveListScreenProps, { 
    activeList: ActiveListModel,
    showChecked: boolean, 
    newAtTop: boolean 
}
> {
  _menu = null;

  constructor(props: EditActiveListScreenProps) {
    super(props);

    let paramsList = this.props.route.params.list;
    this.state = {
        activeList: paramsList,
        showChecked: true,
        newAtTop: true
    };
  }

//   setMenuRef = (ref: any) => {
//     this._menu = ref;
//   };
 
//   hideMenu = () => {
//     this._menu.hide();
//   };
 
//   showMenu = () => {
//     this._menu.show();
//   };

  openActiveListMenu = () => {
    // this.showMenu();
  }
  
//   static navigationOptions = (navigation: any) => {
//     return {
//         title: navigation.getParam('title', 'Edit List'),
//         headerTitleStyle: { 
//             // textAlign:"center", 
//             flex:1 
//         },
//         headerTintColor: '#19647E',
//         headerRight: <View>
//             <Icon style={{paddingRight: 30}} name={'menu'} size={22} color={'#19647E'} onPress={navigation.getParam('openActiveListMenu')}/>
//         </View>
//     }
//   };

  onSaveAsTemplate = () => {
    this.props.route.params.saveAsTemplate(this.state.activeList);
    // this.hideMenu();
  }

  onShowChecked = () => {
    this.props.route.params.onShowChecked();
    this.setState({showChecked: !this.state.showChecked});
  }

  onNewAtTop = () => {
    this.props.route.params.onNewAtTop();
    this.setState({newAtTop: !this.state.newAtTop});
  }

  onEdit = () => {
    this.props.route.params.edit(this.state.activeList);
    // this.hideMenu();
  }

  onChecklistChange(list: ActiveListItemModel[]) {
    let existingList = this.state.activeList;
    this.setState({activeList: {...existingList, items: list}});
    // Save the altered list using the Storage Service
    Storage.saveList({...existingList, items: list}, 'activeLists');
  }

  async componentDidMount() {
    // this.props.navigation.setParams({ openActiveListMenu: this.openActiveListMenu});
    let data = await Storage.getList(this.props.route.params.id, 'activeLists');
    // this.setState({showChecked: this.props.navigation.getParam('showChecked', true)});
    // this.setState({newAtTop: this.props.navigation.getParam('newAtTop', true)});
    
    // Oops:
    // this.setState({activeList: data});
  }

  render() {
    // const { navigation } = this.props;
    console.log("State: ", this.state);
    return ( 
        <View style={styles.container}>
          <View style={{alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            {/* <Menu
              ref={this.setMenuRef}
            >
              <MenuItem onPress={this.onSaveAsTemplate}>
                <FontAwesome style={{marginRight: 10}} name="save" size={18} color="black" />
                <Text style={styles.menuText}>  Save as template</Text>
              </MenuItem>
              <MenuDivider />
              <MenuItem onPress={this.onShowChecked}>
                { this.state.showChecked && <FontAwesome style={{marginRight: 10}} name="eye" size={18} color="black" />}
                { !this.state.showChecked && <FontAwesome style={{marginRight: 10}} name="eye-slash" size={18} color="black" />}
                <Text style={styles.menuText}>  Show checked</Text>
              </MenuItem>
              <MenuDivider />
              <MenuItem onPress={this.onNewAtTop}>
                { this.state.newAtTop && <FontAwesome style={{marginRight: 10}} name="arrow-up" size={18} color="black" />}
                { !this.state.newAtTop && <FontAwesome style={{marginRight: 10}} name="arrow-down" size={18} color="black" />}
                <Text style={styles.menuText}>  New items position</Text>
              </MenuItem>
              <MenuDivider />
              <MenuItem onPress={this.onEdit}>
                <FontAwesome style={{marginRight: 10}} name="edit" size={18} color="black" />
                <Text style={styles.menuText}>  Edit</Text>
              </MenuItem>
            </Menu> */}
          </View>

          <ActiveList
            list={this.state.activeList}
            showChecked={this.state.showChecked}
            newAtTop={this.state.newAtTop}
            onChange={this.onChecklistChange.bind(this)}
          ></ActiveList>
        </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuText: {
    fontSize: 18,
    marginLeft: 10
  }
});
