import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type SpeechResult = {
  result: string;
};

export const useSpeechStore = create(
  immer<SpeechResult>(() => ({
    result: "",
  }))
);

export const updateSpeechResult = (value: string) => {
  useSpeechStore.setState({
    result: value,
  });
};
