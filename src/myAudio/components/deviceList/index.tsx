"use client";

import { AppSection } from "@/components/appSection";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDeviceList } from "../../hooks/useDeviceList";
import { setMediaStream, useSpeechStore } from "../../store";

// devices change event & update devices Info

export const DeviceList = () => {
  const [selected, setSelected] = useState<string>("");
  const { devices } = useDeviceList();

  const handleChange = async (event: SelectChangeEvent) => {
    try {
      const deviceId = event.target.value;
      setSelected(deviceId);

      const constraints = {
        audio: { deviceId: { exact: deviceId } },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // stream.getTracks().forEach((track) => track.stop());

      // 在此处使用新的媒体流进行后续处理
      setMediaStream(stream);
      console.log("已切换到新的音频输入设备", stream);
    } catch (error) {
      console.error("切换设备时出错：", error);
    }
  };

  return (
    <AppSection>
      <h1>devices: </h1>
      <FormControl fullWidth>
        <Select
          value={selected}
          defaultValue={devices?.[0]?.deviceId}
          label="device"
          placeholder="select device"
          onChange={handleChange}
        >
          {devices.map((item) => (
            <MenuItem key={item.deviceId} value={item.deviceId}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </AppSection>
  );
};
