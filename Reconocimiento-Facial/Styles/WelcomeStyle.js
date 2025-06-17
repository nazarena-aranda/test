import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    h1: {
        fontSize: 25,
        fontWeight: 'bold',
        position: 'absolute',
        top: 100,
        left: 50,
        color: 'white',
        fontFamily: 'PoppinsBold',
    },
    button: {
        backgroundColor: '#35b557',
        paddingVertical: 10,
        paddingHorizontal: 20,
        paddingBottom: 15,
        marginTop: 450,
        borderRadius: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'PoppinsRegular',
    },
});

export default styles;