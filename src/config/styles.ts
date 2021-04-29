export const step = 8;

export const grey = '#4A5568';
export const greyLight = '#707070';
export const blue = '#007AFF';
export const black = '#000000';
export const orange = '#ED8936';
export const orangeLight = '#FF7A00';
export const darkOrange = 'rgba(255, 122, 0, 0.1)';
export const white = '#FFFFFF';
export const red = 'red';
export const transparent = 'transparent';
export const borderColor = '#E4E4E4';
export const pageBgColor = '#FBFBFB';

// Use https://ethercreative.github.io/react-native-shadow-generator/
export const generateShadow = (shadowColor: string) => ({
  shadowColor,
  shadowOffset: {
    width: 0,
    height: 1
  },
  shadowOpacity: 0.2,
  shadowRadius: 1.41,

  elevation: 2
});
