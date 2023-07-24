"use client";

import MyDevice from "@/components/myDevice";
import { VoiceLevel } from "@/components/voiceLevel";
import { Button, Divider, List, ListItem } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const colors = ["black", "blue", "brown", "chocolate", "coral", "red"];
const grammar =
  "#JSGF V1.0; grammar colors; public <color> = " + colors.join(" | ") + " ;";

export default function Audio() {
  const [isRecord, setRecordState] = useState<boolean>(false);

  const [state, setState] = useState<string>("");

  const SpeechRecognitionREF = useRef<SpeechRecognition | null>(null);
  const SpeechGrammarListREF = useRef<SpeechGrammarList | null>(null);

  useEffect(() => {
    if ("SpeechRecognition" in window && "SpeechGrammarList" in window) {
      const recognition = new SpeechRecognition();
      SpeechRecognitionREF.current = recognition;

      const grammarList = new SpeechGrammarList();
      SpeechGrammarListREF.current = grammarList;
    } else if (
      "webkitSpeechRecognition" in window &&
      "webkitSpeechGrammarList" in window
    ) {
      const recognition = new webkitSpeechRecognition();
      SpeechRecognitionREF.current = recognition;

      const grammarList = new webkitSpeechGrammarList();
      SpeechGrammarListREF.current = grammarList;
    } else {
      console.log("not support speech");
      return;
    }
    console.log("init success");

    SpeechGrammarListREF.current.addFromString(grammar, 1);

    SpeechRecognitionREF.current.grammars = SpeechGrammarListREF.current;
    //SpeechRecognitionREF.current.continuous = false;
    SpeechRecognitionREF.current.lang = "en-US";
    SpeechRecognitionREF.current.interimResults = false;
    SpeechRecognitionREF.current.maxAlternatives = 1;

    // handle event!

    SpeechRecognitionREF.current.onresult = function (event) {
      var last = event.results.length - 1;
      var color = event.results[last][0].transcript;

      console.log("onresult", color);
      setState(color);
      // diagnostic.textContent = 'Result received: ' + color + '.';
      // bg.style.backgroundColor = color;
      console.log("Confidence: " + event.results[0][0].confidence);
    };

    SpeechRecognitionREF.current.onnomatch = function (event) {
      setState("I didnt recognise that color.");
      console.log("I didnt recognise that color.");
    };

    SpeechRecognitionREF.current.onerror = function (event) {
      setState("Error occurred in recognition: " + event.error);

      console.log("Error occurred in recognition: " + event.error);
    };
  });

  const handleStart = () => {
    if (SpeechRecognitionREF.current) {
      setRecordState(true);
      console.log("record");
      SpeechRecognitionREF.current.start();
    }
  };

  const handleStop = () => {
    if (SpeechRecognitionREF.current) {
      setRecordState(false);
      console.log("stop");
      SpeechRecognitionREF.current.stop();
    }
  };

  return (
    <List className=" flex flex-col gap-1 justify-center px-4">
      <h1 className="text-3xl font-bold underline">Audio</h1>
      {/* device */}
      <MyDevice />

      <Divider />

      <VoiceLevel />

      <Divider />

      {/* <div onClick={handleClick}>start</div> */}
      <ListItem>
        <span>result: </span>
        <p className="hints">{state}</p>
      </ListItem>

      <Divider />

      <div className="flex w-full fixed bottom-1 left-0 px-4">
        <Button
          size="large"
          fullWidth
          type="button"
          variant="outlined"
          onMouseDown={handleStart}
          onMouseUp={handleStop}
          onTouchStart={handleStart}
          onTouchEnd={handleStop}
        >
          {isRecord ? "stop" : "press to start"}
        </Button>
      </div>
    </List>
  );
}
