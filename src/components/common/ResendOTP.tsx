import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import NText from '../ui/NText';

const ResendOTP = ({ onResend }: { onResend: () => void }) => {
  const [timer, setTimer] = useState<number>(30); // Countdown timer in seconds
  const [isCounting, setIsCounting] = useState<boolean>(true); // Track if countdown is active
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade-in animation
  const scaleAnim = useRef(new Animated.Value(1)).current; // For scale effect

  useEffect(() => {
    let countdown: NodeJS.Timeout;

    // Countdown logic
    if (isCounting && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsCounting(false);
      startScaleAnimation();
    }

    return () => clearInterval(countdown);
  }, [isCounting, timer]);

  useEffect(() => {
    // Trigger fade-in animation on component mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const startScaleAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleResend = () => {
    if (isCounting) return; // Prevent action while counting
    onResend?.(); // Trigger resend logic
    setTimeout(() => {
      setTimer(30); // Reset timer
      setIsCounting(true); // Start countdown again
      startScaleAnimation();
    }, 1500)
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      {isCounting ? (
        <NText variant='h6' classname="text-medium50">
          Resend OTP in
          <NText variant='h6' classname="text-dark90">
            {` 00:${timer < 10 ? `0${timer}` : timer}`}
          </NText>
        </NText>
      ) : (
        <TouchableOpacity onPress={handleResend}>
          <NText
            variant='h6'
            classname="text-primary underline"
            fontFamily="Medium"
          >
            Resend OTP
          </NText>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 22,
  },
});

export default ResendOTP;
