import { useMemo, useState } from "react";

export const useSpeechSynthesis = () => {
  // const [state, setState] = useState<boolean>(false);

  function speak(text: string) {
    // Create a new instance of SpeechSynthesisUtterance.
    var msg = new SpeechSynthesisUtterance();

    // Set the text.
    msg.text = text;

    // Set the attributes.

    // If a voice has been selected, find the voice and set the
    // utterance instance's voice attribute.
    // if (voiceSelect.value) {
    //   msg.voice = speechSynthesis.getVoices().filter(function (voice) {
    //     return voice.name == voiceSelect.value;
    //   })[0];
    // }

    // Queue this utterance.
    window.speechSynthesis.speak(msg);
  }

  return useMemo(
    () => ({
      speak,
    }),
    []
  );
};
