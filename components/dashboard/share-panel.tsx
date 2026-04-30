"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SharePanelProps {
  publicUrl: string;
}

export function SharePanel({ publicUrl }: SharePanelProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    void QRCode.toDataURL(publicUrl, { margin: 1, width: 260 }).then(setQrDataUrl);
  }, [publicUrl]);

  const copy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    toast.success("Public link copied.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Share Resume</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground break-all">{publicUrl}</p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={copy}>
            <Copy className="size-4" /> Copy Link
          </Button>
          <Button asChild variant="secondary">
            <a href={publicUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" /> Open Public Page
            </a>
          </Button>
        </div>

        {qrDataUrl ? (
          <div className="mx-auto w-fit rounded-xl border p-3">
            <Image
              src={qrDataUrl}
              alt="Resume QR code"
              width={208}
              height={208}
              className="size-52"
              unoptimized
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
