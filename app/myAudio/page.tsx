"use client";

import { DeviceList } from "@/src/myAudio/components/deviceList";
import { VoiceLevel } from "@/src/myAudio/components/voiceLevel";
import { Button, Divider, List, ListItem } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSpeechRecognition } from "../../src/myAudio/hooks/useSpeechRecognition";
import { useSpeechStore } from "@/src/myAudio/store";
import { animated, useSpring } from "@react-spring/web";
import { useSpeechSynthesis } from "@/src/myAudio/hooks/useSpeechSynthesis";
import { DeviceHeader } from "@/src/myAudio/components/deviceHeader";
import { Action } from "@/src/myAudio/components/Action";
import AudioRecorder from "./demo";

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

  return (
    <List className="h-[100vh] flex flex-col gap-4 px-4 bg-gray-200">
      {/* DeviceHeader */}
      <DeviceHeader />

      {/* device */}
      <DeviceList />

      {/* behavior */}
      <Action />
    </List>
  );
}
