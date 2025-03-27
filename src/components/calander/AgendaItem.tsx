import isEmpty from 'lodash/isEmpty';
import React, { useCallback } from 'react';
import { StyleSheet, Alert, View, Text, TouchableOpacity, Button } from 'react-native';
import { AppColor } from '../../constants/theme';

interface ItemProps {
  item: any;
}

const AgendaItem: React.FC<ItemProps> = ({ item }) => {
  const buttonPressed = useCallback(() => {
    Alert.alert('Show me more');
  }, []);

  const itemPressed = useCallback(() => {
    Alert.alert(item.title);
  }, []);

  if (isEmpty(item)) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned Today</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={itemPressed} style={styles.item}>
      <View>
        <Text style={styles.itemHourText}>{item.hour}</Text>
        <Text style={styles.itemDurationText}>{item.duration}</Text>
      </View>
      <Text style={styles.itemTitleText}>{item.title}</Text>
      <View style={styles.itemButtonContainer}>
        <Button color={AppColor.primary} title="Info" onPress={buttonPressed} />
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(AgendaItem);

const styles = StyleSheet.create({
  item: {
    padding: 16,
    backgroundColor: AppColor.light,
    borderBottomWidth: 1,
    borderBottomColor: AppColor.light20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
    shadowColor: AppColor.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
  itemHourText: {
    color: AppColor.dark90,
    fontWeight: '500',
    fontSize: 14,
  },
  itemDurationText: {
    color: AppColor.medium50,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  itemTitleText: {
    color: AppColor.dark,
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  itemButtonContainer: {
    justifyContent: 'center',
  },
  emptyItem: {
    padding: 16,
    backgroundColor: AppColor.light50,
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  emptyItemText: {
    color: AppColor.light20,
    fontSize: 14,
    textAlign: 'center',
  },
});
