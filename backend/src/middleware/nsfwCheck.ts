import type { Request, Response, NextFunction } from "express";
import * as tf from "@tensorflow/tfjs-node";
import * as nsfw from "nsfwjs";
import fetch from "node-fetch";

let stage1Model: nsfw.NSFWJS | null = null;

// Load Stage 1 model (nsfwjs)
async function loadStage1Model(): Promise<nsfw.NSFWJS> {
  if (!stage1Model) {
    stage1Model = await nsfw.load();
  }
  return stage1Model;
}

// Helper to decode image from buffer
function decodeImage(buffer: Buffer) {
  return tf.node.decodeImage(buffer, 3);
}

// Stage 1: Fast NSFW classification
async function stage1Predict(buffer: Buffer) {
  const model = await loadStage1Model();
  const img = decodeImage(buffer);
  const predictions = await model.classify(img);
  img.dispose();
  return predictions;
}

// Stage 2 placeholder: heavy model
async function stage2Predict(buffer: Buffer) {
  // Example: plug in NudeneNet, CLIP, or other heavy model here
  // For now, we just return the same Stage 1 predictions
  return stage1Predict(buffer);
}

// Final decision based on probabilities
function finalDecision(predictions: { className: string; probability: number }[]): "NSFW" | "SAFE" | "STAGE2" {
  const pornProb = predictions.find(p => p.className === "Porn")?.probability || 0;
  const hentaiProb = predictions.find(p => p.className === "Hentai")?.probability || 0;
  const sexyProb = predictions.find(p => p.className === "Sexy")?.probability || 0;

  // Stage 1 thresholds
  if (pornProb > 0.85 || hentaiProb > 0.85) return "NSFW";
  if (pornProb + hentaiProb > 0.6 || (sexyProb > 0.6 && (pornProb + hentaiProb) > 0.4)) {
    return "STAGE2"; // send to heavy model
  }
  return "SAFE";
}

// Fetch image from URL
async function fetchImageFromUrl(url: string) {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  return buffer;
}

// Middleware
export async function nsfwCheck(req: Request, res: Response, next: NextFunction) {
  try {
    let buffer: Buffer | null = null;

    if (req.file) {
      buffer = req.file.buffer;
    } else if (req.body.imageUrl) {
      buffer = await fetchImageFromUrl(req.body.imageUrl);
    } else {
      return res.status(400).json({ error: "No image provided" });
    }

    // Stage 1
    const stage1Predictions = await stage1Predict(buffer);
    const decision = finalDecision(stage1Predictions);

    if (decision === "SAFE") {
      return res.json({ status: "SAFE", predictions: stage1Predictions });
    } else if (decision === "NSFW") {
      return res.json({ status: "NSFW", predictions: stage1Predictions });
    } else {
      // Stage 2
      const stage2Predictions = await stage2Predict(buffer);
      return res.json({ status: finalDecision(stage2Predictions), predictions: stage2Predictions });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "NSFW check failed" });
  }
}
