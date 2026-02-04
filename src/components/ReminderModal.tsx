import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomModal from './CustomModal';
import {ReminderModalProps, TimeReminder} from '../types';
import {Colors} from '../constants/Colors';
import {getFontSize} from '../utils/responsiveFn';
import Button from './Button';

const ReminderModal: React.FC<ReminderModalProps> = ({
  visible,
  onClose,
  reminderList,
  onUpdateReminders = () => {},
  onRemoveReminder = (reminderTime: string) => {},
  error,
  setError = () => {},
  isSuccess,
}) => {
  const [reminders, setReminders] = useState<any[]>([]);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(true);
  const [isSuccessUpdate, setIsSuccessUpdate] = useState<boolean>(false);

  useEffect(() => {
    if (reminderList) {
      setReminders(reminderList);
    }
  }, [reminderList]);
  useEffect(() => {
    if (isSuccess) {
      setIsUpdate(true);
      setIsSuccessUpdate(false);
    }
  }, [isSuccess]);

  const handleConfirm = useCallback(
    (date: Date) => {
      setShowTimePicker(false);
      const formattedTime = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // ensures 24-hour format
      });

      const newReminder = formattedTime;

      setReminders([...reminders, newReminder]);
      setError(null);
      setIsUpdate(false);
    },
    [reminders],
  );

  // api call to remove reminder
  const removeReminder = useCallback(
    (index: number): void => {
      const newReminders = reminders.filter((i, n) => n !== index);
      setReminders(newReminders);
      // api call to remove reminder
      onRemoveReminder(reminders[index]);
    },
    [reminders],
  );

  const updateReminders = useCallback(() => {
    setError(null);
    setIsSuccessUpdate(true);
    onUpdateReminders(reminders);
  }, [reminders, onUpdateReminders]);

  const renderReminders = useMemo(() => {
    return (
      <FlatList
        data={reminders}
        renderItem={({item, index}) => (
          <View key={index.toString()} style={styles.timeRow}>
            <Text style={styles.timeText}>{item}</Text>
            <TouchableOpacity onPress={() => removeReminder(index)}>
              <AntDesign name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            {error && <Text style={styles.errorText}>{error}</Text>}
            {reminders.length < 5 ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowTimePicker(true)}>
                <AntDesign name="plus" size={24} color="#ff6b00" />
                <Text style={styles.addText}>Add</Text>
              </TouchableOpacity>
            ) : null}
          </>
        }
      />
    );
  }, [reminders, removeReminder, error]);

  return (
    <CustomModal visible={visible} onClose={onClose} title="Reminder">
      <View style={styles.container}>
        <Text style={styles.timeLabel}>TIME</Text>
        {renderReminders}
        {reminders.length > 0 && !isUpdate && (
          <Button
            type="fill"
            title={isSuccessUpdate ? 'Updating...' : 'Update'}
            onPress={updateReminders}
            style={styles.updateButton}
          />
        )}
        <DateTimePickerModal
          isVisible={showTimePicker}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={() => setShowTimePicker(false)}
          is24Hour={true} // Important for 24-hour format
          date={new Date()}
          pickerContainerStyleIOS={{
            alignItems: 'center',
          }}
        />
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: getFontSize(2.5),
    flex: 1,
    zIndex: 1,
  },

  timeLabel: {
    color: Colors.white,
    marginBottom: getFontSize(2),
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.textInputBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  timeText: {
    color: '#fff',
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  addText: {
    color: '#ff6b00',
    fontSize: 16,
  },
  updateButton: {
    bottom: getFontSize(3),
    position: 'absolute',
    // top: getFontSize(20),
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: getFontSize(2),
    fontWeight: '500',
  },
});

export default ReminderModal;
