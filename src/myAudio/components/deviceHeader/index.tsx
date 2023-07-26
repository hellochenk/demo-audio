import { AppSection } from "@/components/appSection";
import { useSpeechStore, setMediaStream } from "../../store";
import { Button, Snackbar } from "@mui/material";
import { useMicrophonePermission } from "../../hooks/useUserMediaPermission";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const DeviceHeader = () => {
  const [isAlertOpen, setAlertOpen] = useState<boolean>(false);

  const mediaStream = useSpeechStore((state) => state.mediaStream);

  const hasMicrophonePermission = useSpeechStore(
    (state) => state.hasMicrophonePermission
  );

  const myRef = useRef({
    successCallback(stream: MediaStream) {
      console.log({ stream });
      setMediaStream(stream);
    },
    fallCallback() {
      setAlertOpen(true);
    },
  });

  const { getPermission } = useMicrophonePermission(myRef.current);

  useEffect(() => {
    getPermission();
  }, [getPermission]);

  return (
    <AppSection>
      <h1 className="text-3xl font-bold underline">
        Audio:
        {hasMicrophonePermission || mediaStream
          ? "Audio Permission Got"
          : "Need Audio Permission"}
      </h1>

      <Button onClick={getPermission}>Click To Get Permission</Button>

      <Snackbar
        open={isAlertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Permission Rejected!
        </Alert>
      </Snackbar>
    </AppSection>
  );
};
