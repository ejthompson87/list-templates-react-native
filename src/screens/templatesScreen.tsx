import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { colors } from "../styles/Variables";

export default function TemplatesScreen({navigation} : {navigation: any}) {

  return (
    <View style={styles.screenTest}>
      <Text>Templates Screen</Text>
      <TouchableHighlight
        onPress={() => navigation.navigate('EditTemplateScreen', {
          title: "test", 
        })}
      >
        <View>
          <Text>Template Here</Text>
        </View>
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  screenTest: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: colors.PRIMARY_COLOR,
  }
});