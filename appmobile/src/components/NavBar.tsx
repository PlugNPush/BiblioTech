import React from 'react';
import { View, StyleSheet } from 'react-native';

import Theme from '@src/components/Theme';

const NavBar: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Other elements in the NavBar can be added here */}
      <Theme />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'gray', // Background color of the NavBar
  },
});

export default NavBar;
