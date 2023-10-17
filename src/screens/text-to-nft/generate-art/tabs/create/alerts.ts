import { Alert } from 'react-native';

export const removeFromImageAlert = () =>
  makeAlert('Remove from image', "Describe what do you don't want in your image, like colors, objects...");

export const generatingFeeAlert = () =>
  makeAlert('Generating fee', 'For generating text to art with AI. Commissions are not included.');

const makeAlert = (title: string, message?: string) =>
  Alert.alert(title, message, [
    {
      text: 'Ok',
      style: 'default'
    }
  ]);
