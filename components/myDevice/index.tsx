"use client";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";

// devices change event & update devices Info

const MyDevice = () => {
  const [selected, setSelected] = useState("default");

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    async function getMicrophonePermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch (error) {
        console.error("无法获取麦克风权限：", error);
        return false;
      }
    }

    async function getAudioInputDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputDevices = devices.filter(
          (device) => device.kind === "audioinput"
        );
        return audioInputDevices;
      } catch (error) {
        console.error("无法获取设备信息：", error);
        return [];
      }
    }

    // 使用示例
    async function main() {
      const hasMicrophonePermission = await getMicrophonePermission();
      if (hasMicrophonePermission) {
        const audioInputDevices = await getAudioInputDevices();
        console.log("音频输入设备信息：", audioInputDevices);
        setDevices(audioInputDevices);
      } else {
        console.log("未获得麦克风权限，无法获取设备信息。");
      }
    }

    main();
  }, []);

  const handleChange = async (event: SelectChangeEvent) => {
    console.log(`val`, event.target.value);
    const deviceId = event.target.value;
    const constraints = {
      audio: { deviceId: { exact: deviceId } },
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      // 在此处使用新的媒体流进行后续处理
      console.log("已切换到新的音频输入设备");
    } catch (error) {
      console.error("切换设备时出错：", error);
    }
  };

  return (
    <div>
      <h1>devices</h1>
      <FormControl fullWidth>
        <Select
          value={selected}
          label="device"
          placeholder="select device"
          onChange={handleChange}
        >
          {/* <MenuItem value="">
            <em>None</em>
          </MenuItem> */}
          {devices.map((item) => (
            <MenuItem key={item.deviceId} value={item.deviceId}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MyDevice;
