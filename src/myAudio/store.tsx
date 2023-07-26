import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type SpeechStore = {
  result: string;
  hasMicrophonePermission: boolean;
  mediaStream: MediaStream | null;
};

const DEFAULT_AUDIO_STATE: SpeechStore = {
  result: "",
  hasMicrophonePermission: false,
  mediaStream: null,
};

export const useSpeechStore = create(
  immer<SpeechStore>(() => DEFAULT_AUDIO_STATE)
);

export const updateSpeechResult = (value: string) => {
  useSpeechStore.setState({
    result: value,
  });
};

export const setMediaStream = (stream: SpeechStore["mediaStream"]) => {
  useSpeechStore.setState((state) => {
    state.mediaStream = stream;
  });
};
