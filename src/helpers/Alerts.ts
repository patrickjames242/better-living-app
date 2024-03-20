import { Platform, Alert } from 'react-native';

export function displaySuccessMessage(message: string) {
  const success = 'Success! 🥳';
  if (Platform.OS === 'web') {
    alert(success + message);
  } else {
    Alert.alert(success, message, [{ text: 'Ok' }]);
  }
}

export function displayErrorMessage(message: string) {
  const oops = 'Oops! 😨';
  if (Platform.OS === 'web') {
    alert(oops + ' ' + message);
  } else {
    Alert.alert(oops, message, [{ text: 'Ok' }]);
  }
}

export const displayTwoDecisionAlert = (
  title: string,
  message: string,
  yesText: string,
  yesAction: () => void,
) => {
  if (Platform.OS === 'web') {
    if (confirm(message)) {
      yesAction();
    }
  } else {
    Alert.alert(title, message, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        onPress: yesAction,
        text: yesText,
      },
    ]);
  }
};

export const displayDeleteConfirmationAlert = (deleteAction: () => void) => {
  displayTwoDecisionAlert(
    'Are you sure?',
    'Are you sure you want to delete this? Once deleted, it cannot be recovered.',
    'Delete',
    deleteAction,
  );
};
