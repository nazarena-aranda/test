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
        fontSize: 20,
        fontWeight: 'bold',
        position: 'absolute',
        top: 100,
        left: 50,
        color: 'white',
        fontFamily: 'PoppinsBold',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 'normal',
        position: 'absolute',
        top: 140,
        left: 50,
        right: 20,
        color: 'white',
        fontFamily: 'PoppinsRegular',
        textAlign: 'left',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 450,
    },
    button: {
        backgroundColor: '#35b557',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        borderRadius: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'PoppinsRegular',
    },
    settingsIcon: {
        position: 'absolute',
        top: 100,
        right: 40,
    },
});

export default styles;