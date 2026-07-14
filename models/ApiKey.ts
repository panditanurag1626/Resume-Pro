import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApiKey extends Document {
  apiKey: string;
  ownerName?: string;
  ownerEmail?: string;
  domain?: string;
  isActive: boolean;
  requestsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ApiKeySchema = new Schema<IApiKey>(
  {
    apiKey: { type: String, required: true, unique: true, index: true },
    ownerName: { type: String },
    ownerEmail: { type: String, lowercase: true, trim: true },
    domain: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    requestsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ApiKey: Model<IApiKey> =
  (mongoose.models.ApiKey as Model<IApiKey>) ||
  mongoose.model<IApiKey>("ApiKey", ApiKeySchema);

export default ApiKey;
