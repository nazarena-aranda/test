import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000', // Fondo negro para la cámara
    },
    title: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'PoppinsRegular',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    pictureContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 10,
    },
    shutterContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 5,
    },
    loadingText: {
        color: 'white',
        marginLeft: 10,
    },
    waitingText: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 5,
    },
});

export default styles;