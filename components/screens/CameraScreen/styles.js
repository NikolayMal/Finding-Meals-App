import { StyleSheet } from "react-native";
import { BoolifiedDeprecatedImageStylePropTypes, borderColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const styles = StyleSheet.create({
    cameraContainer:{
        flex: 1,
    },
    imageBGContainer:{
        flex: 1,
    },
    cameraContentContainer:{
        flex: 1,
        flexDirection: "column",
        padding: 15,
        justifyContent: "flex-end",
    },
    imageReTakenContainer:{
        flexDirection: "row",
        justifyContent: "space-between",
    },
    imageReTakePicture:{
        width: 130,
        height: 40,
        alignItems: "center",
        borderRadius: 4,
    },
    imageRetakeText:{
        color: "#fff",
        fontSize: 20,
    },
    cameraShowContainer:{
        flex: 1,
        backgroundColor: "transparent",
        flexDirection: "row",
    },
    takePictureContainer:{
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        flex: 1,
        width: "100%",
        padding: 20,
        justifyContent: "space-between",
    },
    takePictureContent:{
        alignSelf: "center",
        flex: 1,
        alignItems: "center",
    },
    takePictureButton:{
        width: 70,
        height: 70,
        bottom: 0,
        borderRadius: 50,
        backgroundColor: "#fff",
    }, 

});

export default styles;