import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import IconComponent from './IconComponent';
import {useAuth} from '@/hooks/useAuth';

const NetworkErrorBanner: React.FC = () => {
  const {networkError, isConnected, retryConnection} = useAuth();

  if (!networkError) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <IconComponent
          name="wifi-off"
          size={20}
          color={Colors.white}
          type="MaterialIcons"
        />
        <Text style={styles.message}>
          {!isConnected
            ? 'No internet connection'
            : 'Connection issue. Some features may not work.'}
        </Text>
      </View>
      {isConnected && (
        <TouchableOpacity onPress={retryConnection} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.orange,
    padding: getFontSize(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  message: {
    color: Colors.white,
    fontSize: getFontSize(1.6),
    marginLeft: getFontSize(1),
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: getFontSize(2),
    paddingVertical: getFontSize(0.5),
    borderRadius: getFontSize(1),
  },
  retryText: {
    color: Colors.orange,
    fontSize: getFontSize(1.4),
    fontWeight: '600',
  },
});

export default NetworkErrorBanner;
