import {StyleSheet} from 'react-native';
import {Colors} from './Colors';
import {getFontSize} from '@/utils/responsiveFn';

export const GeneralStyle = StyleSheet.create({
  flex: {
    flex: 1,
  },
  button: {
    width: '80%',
    height: getFontSize(6.5),
    borderRadius: getFontSize(1),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: getFontSize(2),
    borderWidth: 1,
    borderColor: Colors.primary, // Orange border,
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: getFontSize(2.2),
    fontWeight: '500',
    color: Colors.white,
  },
  fillButton: {
    width: '80%',
    height: getFontSize(6.5),
    borderRadius: getFontSize(1),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: getFontSize(1.5),
    flexDirection: 'row',
    backgroundColor: Colors.orange,
    alignSelf: 'center',
  },
  fillButtonText: {
    color: Colors.black,
    fontSize: getFontSize(2.2),
    fontWeight: '500',
  },

  textInput: {
    height: getFontSize(6.5),
    backgroundColor: Colors.textInputBackground,
    borderRadius: getFontSize(1),
    marginBottom: getFontSize(1.5),
    color: Colors.white,
    fontSize: getFontSize(2),
    paddingHorizontal: getFontSize(2),
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    marginBottom: getFontSize(1),
    marginTop: getFontSize(1),
    height: getFontSize(5),
  },
  gradientBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100, // Increase or decrease for a stronger/weaker fade
    zIndex: 9999, // Ensure it appears above FlatList items
  },
  dot: {
    width: getFontSize(1.7),
    height: getFontSize(1.7),
    borderRadius: getFontSize(1),
    backgroundColor: Colors.white,
    marginHorizontal: getFontSize(1),
    opacity: 0.2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  whatWhyHowContainer: {
    borderWidth: 0.5,
    borderColor: Colors.borderColor,
    paddingHorizontal: getFontSize(1.5),
    borderRadius: getFontSize(1),
    marginTop: getFontSize(3),
  },

  layoutContainer: {
    flex: 1,
    width: '95%',
    alignSelf: 'center',
  },

  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: getFontSize(2),
  },
  errorText: {
    color: Colors.white,
    fontSize: getFontSize(2),
    textAlign: 'center',
    marginBottom: getFontSize(1),
  },
  errorSubtext: {
    color: Colors.orange,
    fontSize: getFontSize(1.8),
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  badge: {
    padding: getFontSize(1.5),
  },
  levelText: {
    color: 'white',
    fontSize: getFontSize(2),
    fontWeight: '600',
    alignSelf: 'center',
  },

  headingText: {
    color: Colors.white,
    fontSize: getFontSize(2.3),
    fontWeight: '600',
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  loaderContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: getFontSize(1),
  },

  loader: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors._0d0d0d,
  },

  overlayText: {
    color: Colors.white,
    fontWeight: '400',
    fontSize: getFontSize(1.8),
    marginBottom: 10,
    textAlign: 'center',
    // zIndex: 999, // ✅ Ensure it's above everything
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: getFontSize(2),
  },
  btnStyle: {
    height: getFontSize(3.5),
    width: getFontSize(10),
  },
  btnTextStyle: {
    fontSize: getFontSize(1.8),
  },

  noDataText: {
    color: Colors.white,
    fontSize: getFontSize(3),
    fontWeight: '500',
  },
});
