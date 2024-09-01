import { Alert, Clipboard } from 'react-native';

/**
 * 顯示錯誤警告並允許用戶複製錯誤信息
 * @param {Error} error - 捕獲到的錯誤
 */
export function handleError(error: Error) {
    const errorMessage = `發生錯誤: ${error.message}\n請將此信息複製並發送給技術支持。`;

    Alert.alert(
        "錯誤",
        errorMessage,
        [
            {
                text: "複製錯誤信息",
                onPress: () => {
                    Clipboard.setString(errorMessage);
                    Alert.alert("已複製", "錯誤信息已複製到剪貼板。");
                }
            },
            { text: "關閉", onPress: () => console.log("錯誤警告已關閉") }
        ],
        { cancelable: false }
    );
}
