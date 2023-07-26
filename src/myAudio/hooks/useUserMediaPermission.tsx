import { useCallback, useEffect, useMemo } from "react";

type UseMicrophonePermissionHooksProps = {
  successCallback?: (MediaStream: MediaStream) => unknown;
  fallCallback?: () => unknown;
};

export const useMicrophonePermission = (
  props?: UseMicrophonePermissionHooksProps
) => {
  const { successCallback, fallCallback } = props || {};

  const getPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // clear stream
      stream.getTracks().forEach((track) => track.stop());

      console.log("get");
      successCallback?.(stream);
      return true;
    } catch (error) {
      console.error("无法获取麦克风权限：", error);
      fallCallback?.();
      return false;
    }
  }, [fallCallback, successCallback]);

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
