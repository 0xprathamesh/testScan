"use client"
import { ReactNode, useEffect, useState } from "react";
import { ThirdwebProvider, useActiveAccount} from "thirdweb/react";
import SetRPCModal from "@/components/SetRPCModal";
import VerifySignatureModal from "@/components/VerifySignatureModal";
import { verifyEOASignature } from "thirdweb/auth";
import { signMessage } from "../signmessage";
import "./globals.css"
import { log } from "console";
export default function RootLayout({ children }: { children: ReactNode }) {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const account = useActiveAccount();
  const address = account?.address;
  useEffect(() => {
    const checkInitialVisit = async () => {
      const storedRpcUrl = localStorage.getItem("rpcUrl");

      if (!storedRpcUrl) {
        setIsFirstVisit(true);
      }
    };

    checkInitialVisit();
  }, []);

  useEffect(() => {
    if (address) {
      const storedSignature = localStorage.getItem("userSignature");
      console.log(storedSignature)
      if (!storedSignature) {
        setShowVerifyModal(true);
      }
    }
  }, [address]);

  const handleModalClose = () => {
    setIsFirstVisit(false);
    setShowVerifyModal(false);
  };

  const handleSignMessage = async () => {
    try {
      const timestamp = new Date().toISOString();
      const message = `Hello, please sign this message to verify your identity! Timestamp: ${timestamp}`;

      const { signature, address } = await signMessage(message);

      const isValid = await verifyEOASignature({
        message,
        signature,
        address,
      });

      setSignature(signature);
      setVerificationResult(isValid);

      if (isValid) {
        localStorage.setItem("userSignature", signature);
      }
    } catch (error) {
      console.error("Error during signing or verification:", error);
    }
  };

  return (
    <html lang="en">
      <body>
        <ThirdwebProvider>
          {isFirstVisit && <SetRPCModal onClose={handleModalClose} />}
          {showVerifyModal && (
              <VerifySignatureModal
              onClose={handleModalClose}
              onSignMessage={handleSignMessage}
              signature={signature}
              verificationResult={verificationResult}
            />
          )}
        
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}