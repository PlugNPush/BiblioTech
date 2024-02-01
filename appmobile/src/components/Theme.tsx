
import React, { useContext } from 'react';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import { ThemeContext } from '@src/contexts/ThemeContext';
//import Svg, { Circle, SvgUri } from 'react-native-svg';

const Theme: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const buttonContainerStyle: StyleProp<ViewStyle> = {
    flexDirection: 'row',
    borderWidth: 1, // Bordure pour l'ensemble
    borderRadius: 5,
    borderColor: 'gray', // Couleur de la bordure pour l'ensemble
    padding: 5,
  };
  
  const activeSymbolStyle = {
    //borderWidth: 2, // Bordure pour le symbole actif
    borderRadius: 5,
    borderColor: 'blue', // Couleur de la bordure pour le symbole actif
    backgroundColor: 'blue',
  };
  
  const inactiveSymbolStyle = {

  };

  return (
    <TouchableOpacity onPress={toggleTheme}>
      <View style={buttonContainerStyle}>
        <Text style={theme === 'light' ? activeSymbolStyle : inactiveSymbolStyle}>☀️</Text>
        <Text style={theme === 'dark' ? activeSymbolStyle : inactiveSymbolStyle}>🌙</Text>
      </View>
    </TouchableOpacity>
  );
  
  //<Text style={buttonStyle}>{theme === 'light' ? '☀️' : '🌙'}</Text>
  //return <Button title='Toggle Theme' onPress={toggleTheme} />;

  // use Moon.svg and Sun.svg from /assets
  /*return (
    <TouchableOpacity onPress={toggleTheme}>
      <SvgUri
    width="100%"
    height="100%"
    uri="https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/debian.svg"
/>
    </TouchableOpacity>
  );*/
};

export default Theme;
