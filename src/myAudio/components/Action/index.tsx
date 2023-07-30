"use client";

import { AppSection } from "@/components/appSection";
import { Button, Card, Divider } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSpeechStore } from "../../store";
import { animated, useSpring } from "@react-spring/web";
import { mergeBlobs } from "@/src/utils/blobs";

const sliceLimit = 1000;

export const Action = () => {
  const [isRecorded, setRecordState] = useState<boolean>(false);
  const [speechResult, setSpeechResult] = useState<string>("");
  // TODO: record file ready to upload

  const [volume, setVolume] = useState(0);
  const fileRef = useRef<Blob[]>([]);

  const timerRef = useRef<NodeJS.Timer | null>(null);

  const [props, api] = useSpring(
    () => ({
      from: { length: 0 },
    }),
    []
  );

  const mediaStream = useSpeechStore((state) => state.mediaStream);
  const recorder = useMemo(
    () => (mediaStream ? new MediaRecorder(mediaStream) : null),
    [mediaStream]
  );
  const { audioContext, analyser, source, dataArray } = useMemo(() => {
    if ("AudioContext" in window && mediaStream) {
      const myContext = new AudioContext();
      const myAnalyser = myContext.createAnalyser();

      myAnalyser.fftSize = 256;
      const bufferLength = myAnalyser.frequencyBinCount;
      const myDataArray = new Uint8Array(bufferLength);

      const mysource = myContext.createMediaStreamSource(mediaStream);
      mysource.connect(myAnalyser);

      return {
        audioContext: myContext,
        analyser: myAnalyser,
        source: mysource,
        dataArray: myDataArray,
      };
    }
    return {
      audioContext: null,
      analyser: null,
      source: null,
      dataArray: null,
    };
  }, [mediaStream]);

  const recognition = useMemo(() => {
    const result = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    result.lang = "en-US";
    result.interimResults = false;
    result.maxAlternatives = 1;

    result.addEventListener("start", () => console.log("recognition start"));

    result.addEventListener("result", (event) => {
      var last = event.results.length - 1;
      var myTranscript = event.results[last][0].transcript;
      console.log("speech result", myTranscript);
      setSpeechResult(myTranscript);
    });
    result.addEventListener("error", (e) => {
      console.log("speech error", e);
    });

    return result;
  }, []);

  useEffect(() => {
    if (mediaStream && recorder) {
      console.log({ mediaStream, recorder });

      const handleDataavailable = (e: BlobEvent) => {
        console.log("dataavailable", e);
        fileRef.current.push(e.data);
        // fileRef.current = e.data;
        // setDataSlice([e.data]);
      };

      recorder.addEventListener("dataavailable", handleDataavailable);
      return () => {
        recorder.removeEventListener("dataavailable", handleDataavailable);
      };
    }
  }, [mediaStream, recorder]);

  const handleClear = () => {
    fileRef.current = [];
  };

  const handleStart = () => {
    handleClear();

    if (recorder && mediaStream && audioContext) {
      setRecordState(true);
      recorder.start(sliceLimit);
      recognition.start();

      timerRef.current = setInterval(() => {
        const bufferLength = analyser.frequencyBinCount;
        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        const average = sum / bufferLength;
        setVolume(average);
      }, 100);

      console.log("start recording!");
    }
  };

  const handleStop = () => {
    if (recorder && timerRef.current) {
      setRecordState(false);
      recorder.stop();
      recognition.stop();
      clearInterval(timerRef.current);
      setVolume(0);

      console.log(
        "stop recording! file is",
        fileRef.current,
        "send it to back end and wait for result"
      );
    }
  };

  const handlePlay = () => {
    if (fileRef.current && audioContext) {
      const AudioEle = new Audio();
      const sourceNode = audioContext.createMediaElementSource(new Audio());
      sourceNode.connect(audioContext.destination);
      AudioEle.controls = true;

      console.log("blob slice", fileRef.current);

      AudioEle.src = URL.createObjectURL(mergeBlobs(fileRef.current));
      console.log({ duration: AudioEle.duration });
      AudioEle.addEventListener("loadedmetadata", () => {
        console.log("时长", AudioEle.duration);
      });

      AudioEle.play();
    }
  };

  const handleSTT = () => {
    if (recognition && fileRef.current) {
      console.log("start STT");
      api.start({
        from: {
          length: 0,
        },
        to: {
          length: speechResult.length,
        },
        config: {
          duration: speechResult.length * 100,
        },
      });
      // recognition.start();
      // recognition.audio = fileRef.current;
      // console.log("end");
    }
  };

  return (
    <AppSection>
      <div className="flex flex-col w-full bottom-1 gap-4">
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
          {isRecorded ? "recording" : "press to record"}
          {<span>Volume: {volume}</span>}
        </Button>

        <Divider />

        <Button
          fullWidth
          size="large"
          // disabled={!speechResult}
          type="button"
          variant="outlined"
          onClick={handlePlay}
        >
          play the recording
        </Button>

        <Divider />

        <Button
          fullWidth
          size="large"
          // disabled={!speechResult}
          type="button"
          variant="outlined"
          onClick={handleSTT}
        >
          {/* send record file to backend , and get the result, */}
          FAKE STT
        </Button>
      </div>

      <Divider />

      <Card className="p-4">
        <span className="pr-4">result: </span>
        <div className="hints text-red-300">
          <animated.div>
            {props.length.to((x) =>
              speechResult.slice(0, Number(x.toFixed(0)))
            )}
          </animated.div>
        </div>
      </Card>
    </AppSection>
  );
};
