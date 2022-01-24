import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { ActiveListItemModel } from '../models/ActiveListItemModel';
import { font, colors } from '../styles/Variables';

interface ActiveListItemProps {
    listItem: ActiveListItemModel;
    autoFocus: boolean;
    index: number;
    checked(index: number): void;
    delete(item: ActiveListItemModel): void;
    updateText(index: number, text: string): void;
    textBlur(item: ActiveListItemModel): void;
}

export default class ActiveListItem extends React.Component<ActiveListItemProps> {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.itemContainer}>
          <View style={styles.itemWithCheckboxWrapper}>
            <View>
                // @ts-ignore
                <CheckBox 
                  checked={this.props.listItem.checked} 
                  onPress={() => this.props.checked(this.props.index)} 
                  checkedColor={'#72BCD4'}
                  containerStyle={{ backgroundColor: 'transparent', borderColor: 'transparent', flex: 0.1 }}
                />
            </View>
            <View style={styles.textContainer}>
              <TextInput 
                autoFocus={this.props.autoFocus} 
                style={[styles.itemText, this.props.listItem.checked ? styles.checkedItemText : null]} 
                onChangeText={(text: string) => this.props.updateText(this.props.index, text)} 
                value={this.props.listItem.text}
                onBlur={() => this.props.textBlur(this.props.listItem)}
                textAlignVertical={'center'}
                // onSubmitEditing={() => this.myFunction()}
                // blurOnSubmit={false}
                >
              </TextInput>
            </View>
          </View>
        </View>
        <View style={styles.deleteContainer}> 
          <Ionicons
            name={'md-close'}
            color={'black'}
            size={20}
            style={this.props.listItem.checked ? styles.checkedItemText: null}
            onPress={() => this.props.delete(this.props.listItem)} 
          />
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    // backgroundColor: '#f6f6f6',
    marginBottom: 5,
  },
  itemContainer: {
    flex: 0.9,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  itemWithCheckboxWrapper: {
    flex: 1, 
    flexDirection: 'row',
  },
  deleteContainer: {
    flex: 0.1,
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  textContainer: {
    flex: 0.9,
    marginHorizontal: 10,
    justifyContent: 'center'
  },
  checkedItemText: {
    color: colors.CHECKED_TEXT,
    fontSize: font.FONT_SIZE,
  },
  itemText: {
    fontSize: font.FONT_SIZE,
  }
});