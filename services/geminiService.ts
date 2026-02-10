
import { GoogleGenAI, Type } from "@google/genai";
import { AttendanceRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAttendanceSummary = async (records: AttendanceRecord[]) => {
  const recordsJson = JSON.stringify(records.map(r => ({
    user: r.userName,
    date: r.date,
    status: r.status,
    checkIn: r.checkIn
  })));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyse this attendance data for the HR manager. Provide a concise summary of performance, mention patterns of tardiness, and give 3 actionable suggestions to improve team discipline. Format as markdown. Data: ${recordsJson}`,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate AI summary at this moment.";
  }
};
