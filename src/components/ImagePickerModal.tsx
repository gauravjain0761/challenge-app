import {StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {Colors} from '@/constants/Colors';
import IconComponent from './IconComponent';
import {getFontSize} from '@/utils/responsiveFn';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import {uploadFileToAzure} from '@/api/uploadApi';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';
import {useUpdateProfileMutation} from '@/api/profileApi';
import Loader from './Loader';
import Toast from 'react-native-toast-message';

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedImage?: (image: any) => void;
  onUploadComplete?: (fileUrl: string) => void;
};

const ImagePickerModal = ({
  visible,
  onClose,
  selectedImage,
  onUploadComplete,
}: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const {accessToken} = useSelector((state: RootState) => state.auth);
  const [updateProfile] = useUpdateProfileMutation();

  React.useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const handleUploadToAzure = async (file: {
    uri: string;
    name: string;
    type: string;
  }) => {
    try {
      setIsUploading(true);

      const fileUrl = await uploadFileToAzure(
        file,
        'userprofile',
        accessToken || undefined,
      );

      await updateProfile({profilePicture: fileUrl}).unwrap();

      if (onUploadComplete) {
        onUploadComplete(fileUrl);
      }

      Toast.show({
        text1: 'Profile picture updated successfully!',
        type: 'success',
      });
      handleClose();
    } catch (error: any) {
      console.error('Error uploading to Azure:', error);
      Toast.show({
        text1: error.message || 'Failed to upload profile picture',
        type: 'error',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

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
        uri: image.path,
        name:
          image.filename || `profile_${Date.now()}.${image.mime.split('/')[1]}`,
        type: image.mime,
      };

      if (selectedImage) {
        selectedImage({
          filename: file.name,
          mime: file.type,
          url: file.uri,
        });
      }

      await handleUploadToAzure(file);
    } catch (error: any) {
      if (error.message !== 'User cancelled image selection') {
        console.log('Gallery selection error:', error);
      }
    }
  };

  const onPressCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        multiple: false,
        mediaType: 'photo',
        cropping: true,
        width: 400,
        height: 400,
        compressImageQuality: 0.8,
      });

      const file = {
        uri: image.path,
        name:
          image.filename || `profile_${Date.now()}.${image.mime.split('/')[1]}`,
        type: image.mime,
      };

      if (selectedImage) {
        selectedImage({
          filename: file.name,
          mime: file.type,
          url: file.uri,
          base64: image.data,
        });
      }

      await handleUploadToAzure(file);
    } catch (error: any) {
      if (error.message !== 'User cancelled image selection') {
        console.log('Camera capture error:', error);
      }
    }
  };

  return (
    <>
      {isUploading && <Loader />}
      <Modal
        isVisible={isVisible}
        backdropOpacity={0.7}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={styles.container}
        onBackdropPress={!isUploading ? handleClose : undefined}
        onBackButtonPress={!isUploading ? handleClose : undefined}>
        <LinearGradient
          colors={[Colors.black, Colors.orangeOpacity]}
          style={styles.gradientContainer}>
          <View style={styles.mainContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Select a Image</Text>
              <IconComponent
                name="close"
                size={getFontSize(4)}
                color={Colors.white}
                onPress={onClose}
                style={styles.closeButton}
                type="Ionicons"
              />
            </View>
            <View style={styles.imageContainer}>
              <TouchableOpacity
                onPress={onPressImage}
                style={[styles.imageView, isUploading && styles.disabledView]}
                disabled={isUploading}>
                <IconComponent
                  name="images"
                  type="Ionicons"
                  size={getFontSize(5)}
                  color={isUploading ? Colors._9C9A9A : Colors._C05600}
                />
                <Text
                  style={[
                    styles.imageViewText,
                    isUploading && styles.disabledText,
                  ]}>
                  Gallery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onPressCamera}
                style={[styles.imageView, isUploading && styles.disabledView]}
                disabled={isUploading}>
                <IconComponent
                  name="camera"
                  type="Entypo"
                  size={getFontSize(5)}
                  color={isUploading ? Colors._9C9A9A : Colors._C05600}
                />
                <Text
                  style={[
                    styles.imageViewText,
                    isUploading && styles.disabledText,
                  ]}>
                  Camera
                </Text>
              </TouchableOpacity>
            </View>

            {isUploading && (
              <Text style={styles.uploadingText}>
                Uploading profile picture...
              </Text>
            )}
          </View>
        </LinearGradient>
      </Modal>
    </>
  );
};

export default ImagePickerModal;

const styles = StyleSheet.create({
  container: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  gradientContainer: {
    borderTopLeftRadius: getFontSize(2),
    borderTopRightRadius: getFontSize(2),
  },
  mainContainer: {
    // backgroundColor: Colors.white,
    padding: getFontSize(2),
    borderTopLeftRadius: getFontSize(2),
    borderTopRightRadius: getFontSize(2),
    paddingBottom: getFontSize(5),
  },
  title: {
    color: Colors.white,
    fontSize: getFontSize(3),
    fontWeight: '500',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  imageView: {
    alignItems: 'center',
    gap: getFontSize(1),
  },
  header: {
    marginBottom: getFontSize(3),
    padding: getFontSize(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  imageViewText: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '500',
  },
  disabledView: {
    opacity: 0.5,
  },
  disabledText: {
    color: Colors._9C9A9A,
  },
  uploadingText: {
    color: Colors._C05600,
    fontSize: getFontSize(2),
    fontWeight: '500',
    textAlign: 'center',
    marginTop: getFontSize(2),
  },
});
