import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  wrapper: {
    flex: 1,
    padding: 20,
    flexShrink: 1,
  },
  side: {
    height: 40,
    padding: 20,
    marginLeft: -20,
    marginTop: -20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});
