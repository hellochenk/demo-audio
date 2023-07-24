"use client";

import { useEffect, useRef } from "react";

export const VoiceLevel = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if ("AudioContext" in window) {
      audioContextRef.current = new AudioContext();
    } else if ("webkitAudioContext" in window) {
      // @ts-expect-error ignore this error
      audioContextRef.current = new webkitAudioContext();
    } else {
      console.log("not support audioContextAPI");
      return;
    }

    async function getMicrophoneStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        return stream;
      } catch (error) {
        console.error("无法获取麦克风权限：", error);
        return null;
      }
    }

    function setupAudioAnalyser(stream?: MediaStream) {
      if (!stream) {
        return;
      }
      const mediaStreamSource =
        audioContextRef.current!.createMediaStreamSource(stream);
      const analyserNode = audioContextRef.current!.createAnalyser();

      // 配置AnalyserNode
      analyserNode.fftSize = 256;
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // 连接节点
      mediaStreamSource.connect(analyserNode);

      // 获取音量级别
      function getVolumeLevel() {
        analyserNode.getByteFrequencyData(dataArray);
        let sum = 0;
        dataArray.forEach((value) => (sum += value));
        const average = sum / bufferLength;
        return average;
      }

      // 在此处处理音频数据，例如显示音量级别
      setInterval(() => {
        const volumeLevel = getVolumeLevel();
        console.log("音量级别：", volumeLevel);
        // 在这里你可以根据音量级别来做一些处理
      }, 1000); // 每100毫秒获取一次音量级别
    }

    // 使用示例
    async function main() {
      const stream = await getMicrophoneStream();
      if (stream) {
        setupAudioAnalyser(stream);
      } else {
        console.log("未获得麦克风权限，无法获取音频输入。");
      }
    }

    main();
  }, []);

  return <div>voice level</div>;
};
