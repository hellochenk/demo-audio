import { AppSection } from "@/components/appSection";
import { useSpeechStore, setMediaStream } from "../../store";
import { Button, Snackbar } from "@mui/material";
import { useMicrophonePermission } from "../../hooks/useUserMediaPermission";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import cn from "classnames";

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

  const { getPermission } = useMicrophonePermission();

  const handleRequestPermission = useCallback(() => {
    getPermission()
      .then((res) => {
        if (res) {
          console.log({ res });
          setMediaStream(res);
        } else {
          setAlertOpen(true);
        }
      })
      .catch((error) => {
        console.log({ error });
      });
  }, [getPermission]);

  useEffect(() => {
    handleRequestPermission();
  }, [handleRequestPermission]);

  return (
    <AppSection>
      <h1 className={cn("text-3xl font-bold underline mb-4")}>
        Audio:
        <span className={mediaStream ? "text-green-500" : "text-red-500"}>
          {hasMicrophonePermission || mediaStream
            ? "Audio Permission Got"
            : "Need Audio Permission"}
        </span>
      </h1>

      <Button
        type="button"
        variant="outlined"
        onClick={handleRequestPermission}
      >
        Click To Get Permission
      </Button>

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
