import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import ImagePicker from 'react-native-image-crop-picker';
import Button from '@/components/Button';
import ImageModal from 'react-native-image-modal';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';

const Achievement = ({
  onPress,
  isLoading,
}: {
  onPress?: () => void;
  isLoading?: boolean;
}) => {
  const [image, setImage] = React.useState<any | null>(null);

  const onPressImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        multiple: false,
        mediaType: 'photo',
        cropping: true,
        width: 400,
        height: 400,
        compressImageQuality: 0.8,
      });

      const file = {
        uri: image.path || image?.sourceURL,
        name:
          image.filename || `profile_${Date.now()}.${image.mime.split('/')[1]}`,
        type: image.mime,
      };
      setImage(file);
    } catch (error: any) {
      if (error.message !== 'User cancelled image selection') {
        console.log('Gallery selection error:', error);
      }
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        {image?.uri ? (
          <View style={styles.imageView}>
            <ImageModal
              source={{uri: image?.uri}}
              style={styles.imageStyle}
              modalImageResizeMode="contain"
            />
          </View>
        ) : (
          <FastImage source={Images.image_upload} style={styles.imageStyle} />
        )}
        <TouchableOpacity onPress={onPressImage}>
          <Text style={styles.title}>Upload Image!</Text>
        </TouchableOpacity>
      </View>
      {image && (
        <Button
          title={isLoading ? 'Completing...' : 'Complete'}
          disabled={isLoading}
          onPress={onPress}
        />
      )}
    </View>
  );
};

export default Achievement;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  container: {
    justifyContent: 'center',
    gap: getFontSize(2),
    marginTop: getFontSize(4),
  },
  title: {
    fontSize: getFontSize(2.7),
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
  },

  imageView: {
    alignSelf: 'center',
  },
  imageStyle: {
    height: getFontSize(18),
    width: getFontSize(18),
    borderRadius: getFontSize(1),
    alignSelf: 'center',
  },
});
