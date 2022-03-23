import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { BottomModals } from 'react-native-bottom-dialogs';

export default function App() {
  return (
    <View style={styles.container}>
      <BottomModals
        dialogs={[{ modal: { content: 'Hello' }, id: 'custom', active: true }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
