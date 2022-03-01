import { StyleSheet } from "react-native";
import { BoolifiedDeprecatedImageStylePropTypes, borderColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    buttonContainer: {
        backgroundColor: '#222',
        borderRadius: 5,
        padding: 10,
        margin: 20
    },
    buttonText: {
        textAlign: "center",
        fontSize: 20,
        color: '#fff'
      },
      formContainer: {
        flexDirection: 'row',
        height: 80,
        marginTop: 80,
        marginBottom: 20,
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingLeft: 16,
        flex: 1,
        marginRight: 5
    },
    button: {
        height: 47,
        borderRadius: 5,
        backgroundColor: '#788eec',
        width: 80,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    listContainer: {
        marginTop: 20,
        padding: 20,
        paddingBottom: '10%',
    },
    entityContainer: {
        marginTop: 16,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingBottom: 16,
        flex:1,
        justifyContent:'space-between',
        flexDirection:'row',
        width:"100%"
    },
    entityText: {
        fontSize: 18,
        color: '#333333'
    },
    todoIcons:{
        display:'flex',
        flexDirection:"row"
    },
    todoIcon:{
        marginTop:5,
        fontSize:20,
        marginLeft:10,
    },
    submitIngredients:{
        position: 'absolute',
        bottom:0,
        alignItems: "center",
        justifyContent: 'center',
        paddingBottom: 20,
        paddingTop: 10,
        backgroundColor: '#cccccc',
        width:"100%",
    },
    toCameraScreen:{
        position: 'absolute',
        top: 0,
        paddingBottom: 30,

    },
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