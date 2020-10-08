import { Platform, Alert } from "react-native";




export function displayErrorMessage(message: string) {
    const oops = "Oops! 😨";
    if (Platform.OS === 'web') {
        alert(oops + message);
    } else {
        Alert.alert(oops, message, [{ text: 'Ok' }]);
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

