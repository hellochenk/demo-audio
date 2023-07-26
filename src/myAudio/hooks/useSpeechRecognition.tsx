import { updateSpeechResult } from "@/src/myAudio/store";
import { useEffect, useMemo, useState } from "react";

const colors = ["black", "blue", "brown", "chocolate", "coral", "red"];
const grammar =
  "#JSGF V1.0; grammar colors; public <color> = " + colors.join(" | ") + " ;";

export const useSpeechRecognition = () => {
  const [state, setState] = useState<boolean>(false);

  const [mySpeechRecognition, setSpeechRecognition] =
    useState<SpeechRecognition | null>(null);
  const [mySpeechGrammarList, setSpeechGrammarList] =
    useState<SpeechGrammarList | null>(null);

  useEffect(() => {
    if ("SpeechRecognition" in window && "SpeechGrammarList" in window) {
      const recognition = new SpeechRecognition();
      setSpeechRecognition(recognition);

      const grammarList = new SpeechGrammarList();
      setSpeechGrammarList(grammarList);
    } else if (
      "webkitSpeechRecognition" in window &&
      "webkitSpeechGrammarList" in window
    ) {
      const recognition = new webkitSpeechRecognition();
      setSpeechRecognition(recognition);

      const grammarList = new webkitSpeechGrammarList();
      setSpeechGrammarList(grammarList);
    } else {
      console.log("not support speech");
      return;
    }
    console.log("init success");
  }, []);

  useEffect(() => {
    if (mySpeechRecognition && mySpeechGrammarList) {
      mySpeechGrammarList.addFromString(grammar, 1);

      mySpeechRecognition.grammars = mySpeechGrammarList;
      //mySpeechRecognition.continuous = false;
      mySpeechRecognition.lang = "en-US";
      mySpeechRecognition.interimResults = false;
      mySpeechRecognition.maxAlternatives = 1;

      // handle event!
      mySpeechRecognition.onresult = function (event) {
        var last = event.results.length - 1;
        var myTranscript = event.results[last][0].transcript;

        updateSpeechResult(myTranscript);

        console.log("onresult", myTranscript);
        console.log("Confidence: " + event.results[0][0].confidence);
      };

      mySpeechRecognition.onspeechstart = function () {
        console.log("onspeechstart");
      };

      mySpeechRecognition.onspeechend = function () {
        console.log("onspeechend");
      };

      mySpeechRecognition.onnomatch = function (event) {
        console.log("I didnt recognise that color.");
      };

      mySpeechRecognition.onerror = function (event) {
        console.log("Error occurred in recognition: " + event.error);
      };
    }
  }, [mySpeechGrammarList, mySpeechRecognition]);

  return useMemo(
    () => ({
      mySpeechRecognition,
    }),
    [mySpeechRecognition]
  );
};
