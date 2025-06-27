import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  cameraWrapper: {
    width: 280,
    height: 360,
    borderRadius: 140,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'black',
    marginBottom: 30,
  },
  camera: {
    flex: 1,
  },
  statusContainer: {
    width: 250,
    height:95,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    marginTop: 50,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
    marginRight: 10
  },
  grantedContainer: {
    backgroundColor: '#BCECD3',
  },
  grantedText: {
    color: '#4CCD89',
  },
  deniedContainer: {
    backgroundColor: '#FEBDB1',
  },
  deniedText: {
    color: '#FD7A64',
  },
  capturingText: {
    color: 'green',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  grantedBackground: {
    backgroundColor: '#FAF9F9',
  },
  deniedBackground: {
    backgroundColor: '#FAF9F9',
  },
  shutterContainer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterBtn: {
    width: 70,
    height: 70,
    backgroundColor: 'white',
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
ovalWrapper: {
  alignItems: 'center',
  justifyContent: 'center',
  width: 280,
  height: 450,
  borderRadius: 150,
  overflow: 'hidden',
  borderWidth: 4,
  borderColor: 'black',
  backgroundColor: 'white',
},

maskHole: {
  width: '100%',
  height: '100%',
  borderRadius: 160,
  overflow: 'hidden',
},
  cameraInOval: {
    flex: 1,
    aspectRatio: 3 / 4,
  },

  manualButton: {
  backgroundColor: '#FFFFFF',
  paddingHorizontal: 35,
  paddingVertical: 10,
  borderRadius: 35,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 45,
},
manualIcon: {
  color: 'black',
  fontSize: 40,
},
manualText: {
  color: 'black',
  fontSize: 16,
  fontWeight: 'bold',
}

});

