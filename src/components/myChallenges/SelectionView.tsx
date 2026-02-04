import {Images} from '@/assets/images';
import {Colors} from '@/constants/Colors';
import {PERSONAL_EXP_STEPS} from '@/types/enums';
import {getFontSize} from '@/utils/responsiveFn';
import {get} from 'lodash';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ImageBackground,
} from 'react-native';

interface Props {
  data?: any[];
  selected?: any;
  setSelectedItem?: (item: string | null) => void;
  isCapitalize?: boolean;
}

const SelectionList = ({data, selected, setSelectedItem, isCapitalize = true}: Props) => {
  const [selectedItem, setSelected] = useState<string | null>(null);

  const handleSelect = (item: string) => {
    setSelected(item);
    setSelectedItem?.(item);
  };

  const renderItem = ({item}: {item: string}) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      activeOpacity={0.8}
      style={{
        paddingHorizontal: getFontSize(2),
      }}>
      <ImageBackground
        resizeMode="contain"
        source={
          selectedItem === item
            ? Images.orangeListBG // 🔸 Selected background
            : Images.grayListBG // ⚪ Default background
        }
        style={styles.button}
        imageStyle={styles.imageBackground}>
        <Text style={[styles.buttonText, {textTransform: isCapitalize ? 'capitalize' : 'none'}]}>
          {item === PERSONAL_EXP_STEPS.MINDSET ? 'Mindset' : item}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data ?? []}
        renderItem={renderItem}
        keyExtractor={item => item}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SelectionList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: getFontSize(1),
  },
  button: {
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: getFontSize(8),
  },

  buttonText: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  imageBackground: {
    resizeMode: 'stretch', // or "cover" depending on your asset
  },
});
