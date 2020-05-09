import * as Font from 'expo-font';

export const CustomFont = {
    light: 'Rubik-Light',
    regular: 'Rubik-Regular',
    bold: 'Rubik-Bold',
    black: 'Rubik-Black',
}

export async function loadFonts(): Promise<void>{
    return await Font.loadAsync({
        [CustomFont.light]: require('./font-files/Rubik-Light.ttf'),
        [CustomFont.regular]: require('./font-files/Rubik-Regular.ttf'),
        [CustomFont.bold]: require('./font-files/Rubik-Bold.ttf'),
        [CustomFont.black]: require('./font-files/Rubik-Black.ttf'),
    });
}





