"use client";

import MyDevice from "@/src/myAudio/components/myDevice";
import { VoiceLevel } from "@/src/myAudio/components/voiceLevel";
import { Button, Divider, List, ListItem } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSpeechRecognition } from "../../src/myAudio/hooks/useSpeechRecognition";
import { useSpeechStore } from "@/src/myAudio/store";
import { animated, useSpring } from "@react-spring/web";
import { useSpeechSynthesis } from "@/src/myAudio/hooks/useSpeechSynthesis";
import { DeviceHeader } from "@/src/myAudio/components/deviceHeader";

export default function Audio() {
  const [isRecord, setRecordState] = useState<boolean>(false);

  const [state, setState] = useState<string>("");
  // const { speak } = useSpeechSynthesis();
  // const { mySpeechRecognition } = useSpeechRecognition();

  // const speechResult = useSpeechStore((state) => state.result);

  const [props, api] = useSpring(
    () => ({
      from: { length: 0 },
    }),
    []
  );

  // const handleStart = () => {
  //   if (mySpeechRecognition) {
  //     setRecordState(true);
  //     console.log("record");
  //     mySpeechRecognition.start();
  //   }
  // };

  // const handleStop = () => {
  //   if (mySpeechRecognition) {
  //     setRecordState(false);
  //     console.log("stop");
  //     mySpeechRecognition.stop();
  //   }
  // };

  // const handlePlay = () => {
  //   speak(speechResult);
  //   api.start({
  //     from: {
  //       length: 0,
  //     },
  //     to: {
  //       length: speechResult.length,
  //     },
  //     config: {
  //       duration: speechResult.length * 50,
  //     },
  //   });
  // };

  return (
    <List className="h-[100vh] flex flex-col gap-4 px-4 bg-gray-200">
      {/* DeviceHeader */}
      <DeviceHeader />

      {/* device */}
      <MyDevice />

      {/* <VoiceLevel /> */}

      {/* <Divider /> */}

      {/* <ListItem>
        <span className="pr-4">result: </span>
        <div className="hints text-red-300">
          <animated.div>
            {props.length.to((x) =>
              speechResult.slice(0, Number(x.toFixed(0)))
            )}
          </animated.div>
          {speechResult}
        </div>
      </ListItem> */}

      {/* <div className="flex flex-col w-full fixed bottom-1 left-0 px-4">
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
      </div> */}
    </List>
  );
}
