import { Platform, Alert } from "react-native";




export function displayErrorMessage(message: string) {
    if (Platform.OS === 'web') {
        alert("Oops! " + message);
    } else {
        Alert.alert('Oops!', message, [{ text: 'Ok' }]);
    }
}




export const displayTwoDecisionAlert = (title: string, message: string, yesText: string, yesAction: () => void) => {
    if (Platform.OS === 'web') {
        if (confirm(message)) {
            yesAction();
        }
    } else {
        Alert.alert(title, message, [
            {
                text: "Cancel",
                style: 'cancel',
            },
            {
                onPress: yesAction,
                text: yesText,
            }
        ]);
    }
}

