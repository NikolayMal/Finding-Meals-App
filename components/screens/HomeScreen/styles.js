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
        marginTop: 16,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        paddingBottom: 16
    },
    entityText: {
        fontSize: 20,
        color: '#333333',
        flexWrap: 'wrap',
        flexShrink: 1,
    },buttonContainer: {
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
        padding: 24,
        flexGrow: 0,
        height: "50%",
    },
    previousTextContainer: {
        flexWrap: 'wrap',
        flexShrink: 1,
        padding: 50,
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1,
        borderLeftColor: '#cccccc',
        borderLeftWidth: 1,
        borderTopColor: '#cccccc',
        borderTopWidth: 1,
        borderRightColor: '#cccccc',
        borderRightWidth: 1,
    },
    previousText: {
        fontSize: 20,
        color: '#333333',
        // textShadowColor:'#585858',
        // textShadowOffset:{width: 1, height: 1},
        // textShadowRadius:1,
    },
})