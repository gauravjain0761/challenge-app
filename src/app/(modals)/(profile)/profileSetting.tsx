import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import GradientContainer from '@/components/GradientContainer';
import HeaderBack from '@/components/HeaderBack';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import Button from '@/components/Button';
import LinearGradient from 'react-native-linear-gradient';
import CustomInput from '@/components/CustomInput';
import ImagePickerModal from '@/components/ImagePickerModal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useKeyboard} from '@/utils/common/useKeyboard';
import FastImage from 'react-native-fast-image';
import {selectIsGuestUser, selectProfileData} from '@/features/authSlice';
import {useAppSelector} from '@/hooks/reduxHooks';
import IconComponent from '@/components/IconComponent';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {useUpdateProfileMutation} from '@/api/profileApi';
import {errorToast, successToast} from '@/utils/common/commonFunction';
import Loader from '@/components/Loader';

type DetailsProps = {
  name: string;
  dob: string | null | any;
  location: string;
  //profilePicture: string;
};

const profileSetting = () => {
  const {keyboardVisible} = useKeyboard();
  const profile = useAppSelector(selectProfileData);
  const isGuest = useAppSelector(selectIsGuestUser);

  const [updateProfile, {isLoading}] = useUpdateProfileMutation();
  const [isVisible, setIsVisible] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [isChanged, setIsChanged] = useState(false); // State to track changes

  const [details, setDetails] = useState<DetailsProps>({
    name: '',
    dob: '',
    location: '',
  });

  useEffect(() => {
    if (profile) {
      setDetails({
        name: profile?.name || '',
        dob: profile?.dateOfBirth ? profile?.dateOfBirth : null,
        location: profile?.location || '',
      });
    }
  }, [profile]);

  const onSave = async () => {
    try {
      const data = {
        name: details.name,
        dateOfBirth: details.dob,
        location: details.location,
      };
      const res = await updateProfile(data).unwrap();

      if (res.message) {
        successToast(res.message);
        setIsChanged(false);
      }
    } catch (error: any) {
      console.log('error', error);
      errorToast(error.data?.message || error.message || 'Please try again');
    }
  };

  const handleDetailChange = (key: keyof DetailsProps, value: any) => {
    setDetails(prevDetails => ({...prevDetails, [key]: value}));
    setIsChanged(true);
  };

  return (
    <GradientContainer>
      <HeaderBack title={'Profile settings'} isBackground />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => setIsVisible(true)}
          style={styles.imageMContainer}
          activeOpacity={0.7}>
          {profile?.profilePicture ? (
            <FastImage
              source={{uri: profile?.profilePicture}}
              style={styles.image}
            />
          ) : (
            <LinearGradient
              colors={[Colors._9C9A9A, Colors._893E00]}
              style={styles.imageContainer}>
              <Text style={styles.imageText}>
                {isGuest ? 'G' : profile?.name?.charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
          )}
        </TouchableOpacity>

        <Text style={styles.changePhotoText}>Change Photo</Text>

        <Text style={styles.heading}>User details</Text>
        <View style={styles.detailContainer}>
          <Text style={styles.inputLabel}>Name</Text>
          <CustomInput
            value={details.name}
            onChangeText={t => handleDetailChange('name', t)}
            containerStyle={styles.inputContainer}
          />
          <Text style={styles.inputLabel}>Email</Text>
          <CustomInput
            value={profile?.email}
            containerStyle={styles.inputContainer}
            inputStyle={{color: Colors._9C9A9A}}
            editable={false}
          />
          <Text style={styles.inputLabel}>DOB</Text>
          <CustomInput
            value={details.dob ? moment(details.dob).format('DD/MM/YYYY') : ''}
            containerStyle={styles.inputContainer}
            editable={false}
            rightIcon={
              <IconComponent
                name="calendar"
                size={getFontSize(4)}
                color={Colors._C05600}
                onPress={() => setIsShowDatePicker(true)}
              />
            }
            onPress={() => setIsShowDatePicker(true)}
          />
          {/* </TouchableOpacity> */}

          <Text style={styles.inputLabel}>Location</Text>
          <CustomInput
            value={details.location}
            onChangeText={t => handleDetailChange('location', t)}
            containerStyle={styles.inputContainer}
          />
        </View>
      </KeyboardAwareScrollView>

      <DateTimePickerModal
        isVisible={isShowDatePicker}
        mode="date"
        onConfirm={(date: any) => {
          handleDetailChange('dob', date);
          setIsShowDatePicker(false);
        }}
        onCancel={() => setIsShowDatePicker(false)}
        is24Hour={true}
        date={details.dob ? new Date(details.dob) : new Date()}
        maximumDate={new Date()}
        pickerContainerStyleIOS={{
          alignItems: 'center',
        }}
      />
      <View style={styles.bottomContainer}>
        {!keyboardVisible &&
          isChanged && ( // Show button only if changes are made
            <Button title="Save Changes" style={styles.btn} onPress={onSave} />
          )}
      </View>
      {isVisible && (
        <ImagePickerModal
          visible={isVisible}
          onClose={() => setIsVisible(false)}
          selectedImage={(image: any) => {
            setImage(image);
            setIsChanged(true); // Set change state when image is selected
          }}
        />
      )}
      {isLoading && <Loader />}
    </GradientContainer>
  );
};

export default profileSetting;

const styles = StyleSheet.create({
  imageContainer: {
    width: getFontSize(9),
    height: getFontSize(9),
    borderRadius: getFontSize(7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageMContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: getFontSize(3),
  },
  image: {
    width: getFontSize(8),
    height: getFontSize(8),
    borderRadius: getFontSize(4),
    zIndex: 1,
  },
  imageText: {
    color: Colors.white,
    fontSize: getFontSize(2.5),
    fontWeight: '700',
  },
  changePhotoText: {
    color: Colors.white,
    fontSize: getFontSize(1.5),
    fontWeight: '400',
    marginTop: getFontSize(1),
    textAlign: 'center',
  },
  heading: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '500',
    textTransform: 'uppercase',
    opacity: 0.6,
    marginTop: getFontSize(2),
  },
  detailContainer: {
    backgroundColor: Colors.textInputBackground,
    padding: getFontSize(2),
    borderRadius: getFontSize(1),
    marginTop: getFontSize(2),
  },
  inputLabel: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    fontWeight: '400',
    opacity: 0.6,
  },
  inputContainer: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: Colors.borderColor,
  },
  bottomContainer: {},
  btn: {
    width: '100%',
  },
  closeBtn: {
    borderColor: Colors.red,
    width: '100%',
  },
});
