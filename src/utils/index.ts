import { Alert, Dimensions, Linking, Platform } from "react-native";
import { AppStore } from "../storage/storage";
import { resetAndNavigate } from "./navigationUtils";
import { ILoginResponse } from "../models/common";
import { StorageConstant } from "../storage/constant";
import { decodeJWT, JwtPayload } from "./jwtUtils";
import moment from 'moment';

export const isAndroid = Platform.OS === 'android';
export const isIos = Platform.OS === 'ios';
export const { height, width } = Dimensions.get('window')

export const extractValidationErrors = (error: any): string => {
  if (error?.message && typeof error.message === 'object') {
    // Assuming errors are structured as { fieldName: [errorMessages] }
    return Object.keys(error.message)
      .map((key) => error.message[key][0]) // Get the first error message for each field
      .join(', '); // Join them into a single string
  }

  if (error?.message && typeof error.message === 'string') {
    return error.message
  }

  if (error?.response?.data?.message && typeof error.response?.data?.message === 'string') {
    return error.response?.data?.message
  }

  if (error?.response?.data?.error && error?.response?.data?.data && typeof error?.response?.data?.data === 'string') {
    return error?.response?.data?.data
  }

  if (error?.response?.data && typeof error?.response?.data === 'string') {
    return error?.response?.data
  }

  if (error?.status == 401) {
    return 'Unauthorized.'
  }

  if (error?.status == 405) {
    return 'Method not allowed.'
  }

  if (error?.status == 404) {
    return 'Not found.'
  }

  return 'An unexpected error occurred'; // Fallback message
};

export const globalLogout = () => {
  AppStore.removeSotageItem(StorageConstant.userToken);
  AppStore.removeSotageItem(StorageConstant.fcmToken);
  resetAndNavigate('/welcome');
}

export const getFromAppStorage = () : ILoginResponse | undefined => {
  const userObj = AppStore.getSotageItem<ILoginResponse>(StorageConstant.userToken);

  if (userObj) {
    return userObj
  }
  return undefined;
}

export const getFromLoggedInUser = (claim: keyof JwtPayload) => {
  const userObj = AppStore.getSotageItem<ILoginResponse>(StorageConstant.userToken);

  if (userObj) {
    const all = decodeJWT(userObj?.access_token) ?? undefined
    if (all) {
      return all[claim]
    }
    return undefined
  }
  return undefined;
}

export const formatNumber = (number: string|number|undefined|null, type: undefined | 'Amount' | 'Number' = 'Number', fixed = 2) => {
  if (number === null || number === undefined) return;

  if (type === 'Amount') {
    const currency = 'INR';
    const locale = 'en-IN';
    return new Intl.NumberFormat(locale, {
      style: 'decimal',
      currency: currency,
      minimumFractionDigits: fixed,
      maximumFractionDigits: 2,
    }).format(Number(number));
  }

  // Check if the number contains a decimal
  const numberAsString = number.toString();
  const hasDecimal = numberAsString.includes('.');

  return hasDecimal
    ? Number(number).toFixed(3)
    : Number(number).toFixed(fixed);

}

export const dateFromNow = (utcDate: string): string => {
  const messageTime = moment.utc(utcDate).local(); // Convert to local time
  const now = moment();

  if (messageTime.isSame(now, 'day')) {
    // Same day
    return messageTime.format('hh:mm A');
  } else if (messageTime.isSame(now.subtract(1, 'day'), 'day')) {
    // Yesterday
    return 'Yesterday';
  } else {
    // Older
    return messageTime.format('DD/MM/YYYY'); // Customize as per your need
  }
};

export const openExternalLink = async (url: string) => {
  try {
    await Linking.canOpenURL(url);
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert('Error', error?.message ?? 'Unable to open');
  }
};