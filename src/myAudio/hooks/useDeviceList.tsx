import { useCallback, useEffect, useMemo, useState } from "react";
import { useSpeechStore } from "../store";

export const useDeviceList = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const mediaStream = useSpeechStore((state) => state.mediaStream);

  const fetchDevices = useCallback(async () => {
    if (!mediaStream) {
      return;
    }
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputDevices = devices.filter(
        (device) => device.kind === "audioinput"
      );
      setDevices(audioInputDevices);
    } catch (error) {
      console.error("无法获取设备信息：", error);
      setDevices([]);
      return [];
    }
  }, [mediaStream]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return useMemo(
    () => ({
      devices,
    }),
    [devices]
  );
};
