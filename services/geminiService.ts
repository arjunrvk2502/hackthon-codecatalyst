
import { GoogleGenAI } from "@google/genai";
import type { Patient, ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this example, we'll proceed, but API calls will fail.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateHealthSummary = async (patient: Patient): Promise<string> => {
  if (!API_KEY) {
    return "Error: Gemini API key is not configured.";
  }

  const healthMetricsText = patient.healthMetrics
    .map(m => `- ${m.type}: ${m.value} ${m.unit} (Status: ${m.status}, Trend: ${m.trend})`)
    .join('\n');

  const medicationComplianceText = patient.medicationSchedule
    .map(m => `- ${m.name} (${m.period}): ${m.status}`)
    .join('\n');
    
  const alertsText = patient.alerts.length > 0
    ? patient.alerts.map(a => `- ${a.type}: ${a.details} (${a.timestamp})`).join('\n')
    : 'No alerts today.';

  const symptomsText = patient.symptoms.length > 0
    ? patient.symptoms.map(s => `- ${s.description} (Logged: ${s.timestamp})`).join('\n')
    : 'No symptoms logged today.';

  const prompt = `
    Analyze the following daily health report for an elderly patient named ${patient.name}, age ${patient.age}, and provide a concise, easy-to-understand summary for their caregiver.

    **Today's Vitals:**
    ${healthMetricsText}

    **Medication Compliance:**
    ${medicationComplianceText}
    
    **Recent Alerts:**
    ${alertsText}
    
    **Logged Symptoms:**
    ${symptomsText}

    Based on this data, please generate a summary that includes:
    1. An overall assessment of the patient's current status (e.g., stable, needs attention).
    2. Any specific metrics, alerts, or symptoms that are concerning and require follow-up.
    3. A positive reinforcement note if medication compliance is good.
    
    Keep the summary brief and clear.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating health summary:", error);
    return "An error occurred while generating the health summary. Please check the console for details.";
  }
};

export const generateHealthInsights = async (patient: Patient): Promise<string> => {
  if (!API_KEY) {
    return "Error: Gemini API key is not configured.";
  }
  
  const healthMetricsText = patient.healthMetrics
    .map(m => `- ${m.type}: ${m.value} ${m.unit} (Status: ${m.status}, Trend: ${m.trend})`)
    .join('\n');

  const medicationComplianceText = patient.medicationSchedule
    .map(m => `- ${m.name} (${(m.adherenceRate || 1) * 100}% adherence): ${m.status}`)
    .join('\n');
    
  const alertsText = patient.alerts.length > 0
    ? patient.alerts.map(a => `- ${a.type}: ${a.details}`).join('\n')
    : 'No recent alerts.';

  const symptomsText = patient.symptoms.length > 0
    ? patient.symptoms.map(s => `- ${s.description}`).join('\n')
    : 'No symptoms logged.';

  const prompt = `
    Act as a proactive medical AI assistant. Analyze the following health data for an elderly patient named ${patient.name}, age ${patient.age}. Look for trends, potential risks, and areas for improvement.
    
    **Health Data:**
    - Vitals & Trends:
    ${healthMetricsText}
    - Medication Adherence:
    ${medicationComplianceText}
    - Recent Alerts:
    ${alertsText}
    - Logged Symptoms:
    ${symptomsText}
    
    Based on this data, provide **actionable insights and predictive alerts**. Do not just summarize.
    1. Identify any worrying trends (e.g., consistently rising blood pressure, frequent dizziness combined with low SpO2).
    2. Predict potential short-term risks (e.g., "The patient's logged dizziness and elevated blood pressure could indicate a risk of falling.").
    3. Suggest specific, actionable advice for the caregiver (e.g., "Consider scheduling a doctor's appointment to discuss blood pressure," or "A gentle walking routine might help improve circulation.").
    
    Format the output clearly with Markdown headings for "**Potential Risks**" and "**Suggestions**".
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating health insights:", error);
    return "An error occurred while generating health insights.";
  }
};


export const getChatbotResponse = async (patient: Patient, history: ChatMessage[], newMessage: string): Promise<string> => {
    if (!API_KEY) {
        return "Error: Gemini API key is not configured.";
    }
    
    const systemInstruction = `You are "CareBot", a friendly and empathetic AI health assistant for the CareConnect app. Your role is to support caregivers, patients, and doctors. Start the conversation by asking how the patient is feeling.
    
    Current Patient Context:
    - Name: ${patient.name}
    - Age: ${patient.age}
    - Conditions: ${patient.conditions || 'Not specified'}
    - Allergies: ${patient.allergies || 'Not specified'}

    Your tasks are:
    1.  Ask clarifying questions about the patient's current condition or symptoms.
    2.  Provide general suggestions for health improvement, including diet, light exercises, and meditation suitable for an elderly person.
    3.  Suggest what to avoid based on their conditions.
    4.  If asked about specific medications, you can provide general information but CANNOT prescribe or change dosages.
    5.  Maintain a supportive and reassuring tone.
    
    **CRITICAL RULE: Always end your response with the following disclaimer, formatted exactly as shown:**
    ---
    *Disclaimer: I am an AI assistant. The information provided is for general guidance only and is not a substitute for professional medical advice. Please consult a qualified healthcare provider for any medical concerns.*
    `;

    const chatHistory = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));
    
    const contents = [
        ...chatHistory,
        { role: 'user', parts: [{ text: newMessage }] }
    ];

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: {
                systemInstruction,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error in chatbot response generation:", error);
        return "Sorry, I encountered an error. Please try again.";
    }
};
