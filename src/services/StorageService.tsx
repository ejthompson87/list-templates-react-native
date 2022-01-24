import { AsyncStorage } from 'react-native';
import { ActiveListModel } from '../models/ActiveListModel';

export const saveLists = async (lists: ActiveListModel[], listsName: string) => {
    try {
        await AsyncStorage.setItem(listsName, JSON.stringify(lists));
    } catch (error) {
        // Error retrieving data
        console.log(error.message);
    }
}

export const saveList = async (list: ActiveListModel, listsName: string) => {
    let lists = await getLists(listsName);
    let index = lists.findIndex((l: ActiveListModel) => l.id === list.id);
    if (index === -1) {
        lists.push(list);
    } else {
        lists[index] = list;
    }
    await saveLists(lists, listsName);
} 

export const getLists = async (listsName: string) => {
    try {
      let lists = await AsyncStorage.getItem(listsName) || 'none';
      return JSON.parse(lists);
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
    return [];
}


export const getList = async (id: string, listsName: string) => {
    try {
        let lists = await getLists(listsName);
        return lists.find((list: ActiveListModel) => list.id === id)
    } catch (error) {
        console.log(error.message)
    }
}

export const deleteLists = async (listsName: string) => {
    try {
      await AsyncStorage.removeItem(listsName);
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
}