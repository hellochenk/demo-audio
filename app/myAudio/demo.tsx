import React, { useState, useRef } from "react";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [recordedBlobs, setRecordedBlobs] = useState([]);
  const [volume, setVolume] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const analyserRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current = mediaRecorder;

      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      mediaRecorder.start();
      setRecording(true);

      const volumeMeter = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        const average = sum / bufferLength;
        setVolume(average);
      }, 100);

      return () => {
        mediaRecorder.stop();
        setRecording(false);
        clearInterval(volumeMeter);
      };
    } catch (err) {
      console.error("Error accessing audio stream:", err);
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedBlobs((prevBlobs) => [...prevBlobs, event.data]);
    }
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      <div>Volume: {volume}</div>
    </div>
  );
};

export default AudioRecorder;
