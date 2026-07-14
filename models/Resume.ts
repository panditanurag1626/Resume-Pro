import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Resume model.
 *
 * `userId` is intentionally optional — the public API mirrors the Flask app
 * at main.py which is anonymous (no auth, anyone can upload). Older records
 * may still carry a `userId` from the previous NextAuth-backed UI; we keep
 * the field but no longer require it.
 */
export interface IResume extends Document {
  userId?: string;
  filename?: string;
  title: string;
  data: any; // Full JSON Resume payload (basics, work, education, ...)
  templateId: number;
  lastAtsScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: {
      type: String,
      required: false,
      index: true,
    },
    filename: { type: String, default: null, trim: true },
    title: { type: String, default: "Untitled Resume", trim: true },
    data: { type: Schema.Types.Mixed, default: {} },
    templateId: { type: Number, default: 1 },
    lastAtsScore: { type: Number },
  },
  { timestamps: true, strict: false }
);

const Resume: Model<IResume> =
  (mongoose.models.Resume as Model<IResume>) ||
  mongoose.model<IResume>("Resume", ResumeSchema);

export default Resume;
