"use client"

import { useState, useRef, useEffect } from "react"
import type React from "react"
import QRCode from "react-qr-code"
import { useToast } from "@/hooks/use-toast"
import { Download, Copy, ArrowLeft } from "lucide-react" // Import Copy and ArrowLeft icons

const QR_SIZE = 180
const EXPORT_SCALE = 3

interface QrCodeGeneratorProps {
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  isValidHttpUrl: (alias: string) => boolean;
}

export function QrCodeGenerator({ url, setUrl, isValidHttpUrl }: QrCodeGeneratorProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("")
  const [showQrCode, setShowQrCode] = useState(false) // New state to control QR code visibility
  const [foregroundColor, setForegroundColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [padding, setPadding] = useState(16)
  const [includeLogo, setIncludeLogo] = useState(true)
  const qrCodeRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const generateQrCodeImage = () => {
    if (qrCodeRef.current) {
      const svgElement = qrCodeRef.current.querySelector('svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement)
        const canvas = document.createElement('canvas');
        const outputSize = (QR_SIZE + padding * 2) * EXPORT_SCALE
        canvas.width = outputSize
        canvas.height = outputSize
        const ctx = canvas.getContext('2d')
        const img = new Image();

        img.onload = () => {
          if (!ctx) {
            return
          }

          ctx.fillStyle = backgroundColor
          ctx.fillRect(0, 0, outputSize, outputSize)
          ctx.drawImage(
            img,
            padding * EXPORT_SCALE,
            padding * EXPORT_SCALE,
            QR_SIZE * EXPORT_SCALE,
            QR_SIZE * EXPORT_SCALE,
          )

          if (includeLogo) {
            const logo = new Image()
            logo.onload = () => {
              const logoSize = QR_SIZE * EXPORT_SCALE * 0.22
              const logoX = (outputSize - logoSize) / 2
              const logoY = (outputSize - logoSize) / 2
              const logoPadding = logoSize * 0.12

              ctx.fillStyle = backgroundColor
              ctx.fillRect(
                logoX - logoPadding,
                logoY - logoPadding,
                logoSize + logoPadding * 2,
                logoSize + logoPadding * 2,
              )
              ctx.drawImage(logo, logoX, logoY, logoSize, logoSize)
              setQrCodeDataUrl(canvas.toDataURL('image/png'))
            }
            logo.src = "/sceptix-logo.png"
          } else {
            setQrCodeDataUrl(canvas.toDataURL('image/png'))
          }
        }
        const svgBlob = new Blob([svgData], { type: "image/svg+xml" })
        img.src = URL.createObjectURL(svgBlob)
      }
    }
  };

  useEffect(() => {
    if (url && showQrCode) { // Only generate if URL is present and showQrCode is true
      generateQrCodeImage();
    }
  }, [url, showQrCode, foregroundColor, backgroundColor, padding, includeLogo]); // Depend on customization options as well

  const handleGenerateQrCode = async () => {
    if (!isValidHttpUrl(url)){
      toast({
        title: "Invalid URL",
        description: "Please enter a valid http(s) link.",
        variant: "destructive",
      })
      return;
    }

    if (url) {
      setShowQrCode(true);
      // The QR code generation and copy to clipboard will now be handled by the useEffect hooks
    } else {
      toast({
        title: "Error",
        description: "Please enter a URL to generate a QR code.",
        variant: "destructive",
      });
    }
  };

  const downloadQrCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "QR Code Downloaded!",
        description: "The QR code has been downloaded successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "QR Code not available for download.",
        variant: "destructive",
      });
    }
  };

  const copyQrCodeToClipboard = async () => {
    if (qrCodeDataUrl) {
      try {
        const response = await fetch(qrCodeDataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
        toast({
          title: "QR Code Copied!",
          description: "The QR code has been copied to your clipboard.",
        });
      } catch (error) {
        console.error("Failed to copy QR code:", error);
        toast({
          title: "Error",
          description: "Failed to copy QR Code to clipboard.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "QR Code not available for copy.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full space-y-6 relative">
      {/* <div className="space-y-3"> */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerateQrCode();
        }}
        className="space-y-3"
      >
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setShowQrCode(false); // Hide QR code when URL changes
          }}
          placeholder="Paste your long URL here..."
          className="w-full px-4 py-3 bg-gray-11/5 border border-gray-11/10 rounded-xl text-slate-12 placeholder:text-gray-9 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 transition-all"
          required
        />
        <button
          onClick={handleGenerateQrCode}
          disabled={!url}
          className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          Generate QR Code
        </button>
      </form>
      {/* </div> */}

      {showQrCode && url && ( // Only show QR code if showQrCode is true and URL is present
        <div className="relative bg-black/10 border border-black/30 rounded-xl p-4 flex flex-col items-center justify-center space-y-3 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
          <p className="text-xs text-black dark:text-white font-medium mb-1">QR Code for: {url}</p>
          <div className="grid grid-cols-2 gap-3 text-left">
            <label className="flex items-center justify-between gap-2 rounded-lg border border-black/10 bg-black/5 px-3 py-2 text-xs text-slate-11">
              QR color
              <input
                type="color"
                value={foregroundColor}
                onChange={(event) => setForegroundColor(event.target.value)}
                className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
              />
            </label>
            <label className="flex items-center justify-between gap-2 rounded-lg border border-black/10 bg-black/5 px-3 py-2 text-xs text-slate-11">
              Background
              <input
                type="color"
                value={backgroundColor}
                onChange={(event) => setBackgroundColor(event.target.value)}
                className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
              />
            </label>
            <label className="col-span-2 space-y-1 rounded-lg border border-black/10 bg-black/5 px-3 py-2 text-xs text-slate-11">
              <span className="flex justify-between">
                Padding <span>{padding}px</span>
              </span>
              <input
                type="range"
                min="0"
                max="48"
                step="4"
                value={padding}
                onChange={(event) => setPadding(Number(event.target.value))}
                className="w-full accent-black"
              />
            </label>
            <label className="col-span-2 flex items-center justify-between rounded-lg border border-black/10 bg-black/5 px-3 py-2 text-xs text-slate-11">
              Add Sceptix logo
              <input
                type="checkbox"
                checked={includeLogo}
                onChange={(event) => setIncludeLogo(event.target.checked)}
                className="h-4 w-4 accent-black"
              />
            </label>
          </div>
          <div
            ref={qrCodeRef}
            className="relative rounded-lg group"
            style={{ backgroundColor, padding }}
          >
            <QRCode
              value={url}
              size={QR_SIZE}
              fgColor={foregroundColor}
              bgColor={backgroundColor}
              level="H"
              style={{ display: "block" }}
            />
            {includeLogo && (
              <span
                className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-sm"
                style={{ backgroundColor, padding: QR_SIZE * 0.22 * 0.12 }}
              >
                <img
                  src="/sceptix-logo.png"
                  alt=""
                  className="h-[39.6px] w-[39.6px]"
                />
              </span>
            )}
            <button
              onClick={copyQrCodeToClipboard}
              disabled={!qrCodeDataUrl}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg cursor-pointer disabled:cursor-not-allowed"
              aria-label="Copy QR Code"
            >
              <Copy className="w-8 h-8" />
            </button>
          </div>
          <div className="flex w-full gap-2">
            <button
              onClick={downloadQrCode}
              disabled={!qrCodeDataUrl}
              className="flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download QR
            </button>
          </div>
          <button
            onClick={() => {
              setUrl("");
              setShowQrCode(false);
            }}
            className="absolute top-4 left-4 text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  )
}
