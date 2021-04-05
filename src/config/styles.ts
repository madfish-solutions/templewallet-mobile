export const step = 8;

export const grey = '#4A5568';
export const orange = '#ED8936';
export const white = '#FFFFFF';
export const red = 'red';
export const transparent = 'transparent';

export enum zIndexesEnum {
  Modal = 1000,
  Overlay = 900
}

// Use https://ethercreative.github.io/react-native-shadow-generator/
export const generateShadow = (shadowColor: string) => ({
  shadowColor,
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,

  elevation: 5
});
