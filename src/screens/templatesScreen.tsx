import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../styles/Variables";

export default function TemplatesScreen() {
  return (
    <View style={styles.screenTest}>
      <Text>Templates Screen</Text>
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