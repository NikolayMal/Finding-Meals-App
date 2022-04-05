import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    formContainer: {
        flexDirection: 'row',
        height: 80,
        marginTop: 40,
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
    },
    entityContainer: {
        marginTop: 10,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingBottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    entityText: {
        fontSize: 20,
        color: '#020202',
        flexWrap: 'wrap',
        flexShrink: 1,
        padding: 5,
    },
    entityImage: {
        width: "70%",
        height: 150,
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        backgroundColor: '#222',
        borderRadius: 5,
        padding: 10,
        margin: 20
    },
    image: {
        width: 50,
        height: 50,
    },
    flatliststyle: { 
        width: "90%",
        height: "85%",
    },
    previousText: {
        fontSize: 20,
        color: '#333333',
        // textShadowColor:'#585858',
        // textShadowOffset:{width: 1, height: 1},
        // textShadowRadius:1,
    },
    homeButton: {
        padding: 20,
        marginBottom: 5
    },
    homeButton2: {
        marginTop: -5,
        paddingBottom: 10,
    },
    flatlistContainer: {
        // alignContent: "center",
        // justifyContent: "center",
        paddingTop: 10,
    },
    titleText: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
    },
    linkText: {
        color: 'blue', 
        fontStyle: 'italic', 
        textDecorationLine: 'underline',
        fontSize: 15,
    },
    goToRecipe: {
        padding: 5,
        paddingBottom: -3,
    },
})