import React from 'react';
import { View, Text, TextInput, KeyboardTypeOptions } from 'react-native';
import { styles } from '../styles/profile.styles';


const UserDetailItem = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="tail">
      {value}
    </Text>
  </View>
);

export default UserDetailItem;
