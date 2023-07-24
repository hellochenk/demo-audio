"use client";

import MyDevice from "@/components/myDevice";
import { VoiceLevel } from "@/components/voiceLevel";
import { Button, Divider, List, ListItem } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSpeechRecognition } from "../../src/audio/useSpeechRecognition";
import { useSpeechStore } from "@/src/audio/store";
import { animated, useSpring } from "@react-spring/web";
import { useSpeechSynthesis } from "@/src/audio/useSpeechSynthesis";

export default function Audio() {
  const [isRecord, setRecordState] = useState<boolean>(false);

  const [state, setState] = useState<string>("");

  const { mySpeechRecognition } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();
  const speechResult = useSpeechStore((state) => state.result);

  const [props, api] = useSpring(
    () => ({
      from: { length: 0 },
    }),
    []
  );

  // useEffect(() => {
  //   api.start({
  //     from: {
  //       length: 0,
  //     },
  //     to: {
  //       length: speechResult.length,
  //     },
  //     config: {
  //       duration: speechResult.length * 100,
  //     },
  //   });
  // }, [api, speechResult]);

  const handleStart = () => {
    if (mySpeechRecognition) {
      setRecordState(true);
      console.log("record");
      mySpeechRecognition.start();
    }
  };

  const handleStop = () => {
    if (mySpeechRecognition) {
      setRecordState(false);
      console.log("stop");
      mySpeechRecognition.stop();
    }
  };

  const handlePlay = () => {
    speak(speechResult);
    api.start({
      from: {
        length: 0,
      },
      to: {
        length: speechResult.length,
      },
      config: {
        duration: speechResult.length * 50,
      },
    });
  };

  return (
    <List className=" flex flex-col gap-1 justify-center px-4">
      <h1 className="text-3xl font-bold underline">Audio</h1>
      {/* device */}
      <MyDevice />

      <Divider />

      {/* <VoiceLevel /> */}

      <Divider />

      <ListItem>
        <span className="pr-4">result: </span>
        <div className="hints text-red-300">
          <animated.div>
            {props.length.to((x) =>
              speechResult.slice(0, Number(x.toFixed(0)))
            )}
          </animated.div>
          {speechResult}
        </div>
      </ListItem>

      <Divider />

      <div className="flex flex-col w-full fixed bottom-1 left-0 px-4">
        <Button
          fullWidth
          size="large"
          type="button"
          variant="outlined"
          onMouseDown={handleStart}
          onMouseUp={handleStop}
          onTouchStart={handleStart}
          onTouchEnd={handleStop}
        >
          {isRecord ? "stop" : "press to start"}
        </Button>
        <Divider />
        <Button
          fullWidth
          size="large"
          disabled={!speechResult}
          type="button"
          variant="outlined"
          onClick={handlePlay}
        >
          play
        </Button>
      </div>
    </List>
  );
}
