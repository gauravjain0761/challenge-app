import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AppState,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';
import IconComponent from '../IconComponent';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';
import LinearGradient from 'react-native-linear-gradient';

const ReviewList = ({isHellChallenge}: {isHellChallenge?: boolean}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [dataIndex, setDataIndex] = useState<number>(0);
  const [randomNumber, setRandomNumber] = useState<number>(
    Math.floor(Math.random() * 2500),
  );
  const [randomNumber2, setRandomNumber2] = useState<number>(
    Math.floor(Math.random() * 72),
  );
  const [randomNumber3, setRandomNumber3] = useState<number>(
    Math.floor(Math.random() * 502200),
  );

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        setRandomNumber(Math.floor(Math.random() * 2500));
        setRandomNumber2(Math.floor(Math.random() * 72));
        setRandomNumber3(Math.floor(Math.random() * 502200));
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription?.remove();
  }, []);

  const reviews = [
    {
      image: Images.review1,
      text: 'I now have a morning routine I actually stick to',
      author: 'Carlos B',
    },
    {
      image: Images.review2,
      text: "I didn't even know so many challenges existed",
      author: 'Alex A',
    },
    {
      image: Images.review3,
      text: 'You can tell this app is created for men, nails it',
      author: 'Derek H',
    },
  ];

  const reviewsData = [
    `${randomNumber} Men Recently Upgraded`,
    `${randomNumber2} Men just completed their first challenge`,
    `${randomNumber3} Challenges completed so far`,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDataIndex(prevIndex =>
        prevIndex === reviewsData.length - 1 ? 0 : prevIndex + 1,
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [reviewsData.length]);

  const onPressLeft = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1,
    );
  };

  const onPressRight = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const currentReview = reviews[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <LinearGradient
          colors={['#FFFFFF', isHellChallenge ? Colors._FE0D0D : '#893E00']}
          start={{x: 0.0, y: 0.0}}
          end={{x: 0.99, y: 1.0}}
          style={styles.frame}>
          <Text style={styles.dataText}>{reviewsData[dataIndex]}</Text>
        </LinearGradient>

        <View
          style={{
            paddingHorizontal: getFontSize(2),
            marginTop: getFontSize(5),
          }}>
          <FastImage
            source={currentReview.image}
            resizeMode="cover"
            style={styles.image}
          />
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={onPressLeft}
              style={[
                styles.iconView,
                isHellChallenge && {borderColor: Colors._FE0D0D},
              ]}>
              <IconComponent
                size={getFontSize(2.5)}
                name="left"
                color={Colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPressRight}
              style={[
                styles.iconView,
                isHellChallenge && {borderColor: Colors._FE0D0D},
              ]}>
              <IconComponent
                size={getFontSize(2.5)}
                name="right"
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text
          style={{
            ...styles.reviewText,
            fontWeight: '400',
            marginTop: getFontSize(3),
            width: SCREEN_WIDTH - getFontSize(10),
            alignSelf: 'center',
          }}>
          {`“${currentReview.text}”`}
        </Text>
        <View style={styles.row}>
          {[1, 2, 3, 4, 5].map((_, n) => (
            <IconComponent
              key={n.toString()}
              size={getFontSize(2)}
              name="star"
              color={isHellChallenge ? Colors._FE0D0D : Colors.orange}
            />
          ))}
          <Text style={styles.reviewText}>{currentReview.author}</Text>
        </View>
      </View>
    </View>
  );
};

export default ReviewList;

const styles = StyleSheet.create({
  container: {
    marginTop: getFontSize(3),
  },
  imageContainer: {
    marginBottom: getFontSize(3),
  },
  image: {
    height: getFontSize(30),
    width: '100%',
    borderRadius: getFontSize(2),
    overflow: 'hidden',
    alignSelf: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    gap: getFontSize(0.5),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: getFontSize(-3.5),
    paddingHorizontal: getFontSize(4),
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
  },
  iconView: {
    height: getFontSize(6),
    width: getFontSize(6),
    borderRadius: getFontSize(7),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.orange,
    backgroundColor: Colors.orangeOpacity2,
  },
  row: {
    flexDirection: 'row',
    gap: getFontSize(0.5),
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: getFontSize(0.5),
  },
  reviewText: {
    fontSize: getFontSize(2.4),
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
    paddingHorizontal: getFontSize(1),
  },

  frame: {
    width: SCREEN_WIDTH,
    height: getFontSize(6.5),
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    marginTop: getFontSize(1),
  },
  dataText: {
    fontSize: getFontSize(2.2),
    fontWeight: '600',
    color: Colors.black,
    textAlign: 'center',
  },
});
