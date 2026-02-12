import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { useToast } from "@/hooks/useToast";

interface QrScannerProps {
  onScan: (result: string) => void;
  onError: (error: string) => void;
}

export function QrScanner({ onScan, onError }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const { toast } = useToast();
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasPermission(true);
        stream.getTracks().forEach(track => track.stop());

        const codeReader = new BrowserQRCodeReader();

        if (videoRef.current) {
          controlsRef.current = await codeReader.decodeFromVideoDevice(
            undefined, // Use default camera
            videoRef.current,
            (result) => {
              if (result) {
                onScan(result.getText());
              }
            }
          );
        }
      } catch (error) {
        console.error('Scanner initialization error:', error);
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError') {
            toast({
              variant: "destructive",
              title: "Camera Access Denied",
              description: "Please allow camera access to scan QR codes",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Scanner Error",
              description: "Failed to initialize camera. Please try again.",
            });
          }
        }
        onError(error instanceof Error ? error.message : 'Failed to initialize scanner');
      }
    };

    initializeScanner();

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, [onScan, onError, toast]);

  if (!hasPermission) {
    return (
      <div className="text-center p-4">
        <p className="text-lg font-medium mb-2">Camera Permission Required</p>
        <p className="text-sm text-muted-foreground">
          Please allow camera access to scan QR codes
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <video
        ref={videoRef}
        className="w-full aspect-square rounded-lg bg-black"
      />
      <p className="text-sm text-muted-foreground mt-2 text-center">
        Position the QR code within the frame to scan
      </p>
    </div>
  );
}