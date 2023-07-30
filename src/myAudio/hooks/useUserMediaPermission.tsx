import { useCallback, useEffect, useMemo } from "react";
import { useSpeechStore } from "../store";

export const useMicrophonePermission = () => {
  const getPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      // stream.getTracks().forEach((track) => track.stop());
      return stream;
    } catch (error) {
      console.error("无法获取麦克风权限：", error);
      return null;
    }
  }, []);

  const testDevicesInfo = async () => {
    try {
      const deviceInfo = await navigator.mediaDevices.enumerateDevices();
      console.log({ deviceInfo });
    } catch (error) {
      console.log("test error", error);
    }
  };

  const getUserSupportedConstraints = () => {
    const supportedConstraints =
      navigator.mediaDevices.getSupportedConstraints();
    console.log({ supportedConstraints });
    return supportedConstraints;
  };

  useEffect(() => {
    navigator.mediaDevices.addEventListener("ondevicechange", (e) =>
      console.log("devicechange", e)
    );
  }, []);

  return useMemo(() => {
    return {
      getPermission,
      testDevicesInfo,
      getUserSupportedConstraints,
    };
  }, [getPermission]);
};
