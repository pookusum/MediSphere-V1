const functions = require("firebase-functions");
const axios = require("axios");

exports.generateReferral = functions.https.onRequest(async (req, res) => {
  try {
    const patientData = req.body;

    const hospitals = [
      {
        name: "Village PHC",
        distance_km: 3,
        available_beds: 6,
        available_icu: 0,
        ventilators: 0,
      },
      {
        name: "District Hospital",
        distance_km: 15,
        available_beds: 40,
        available_icu: 4,
        ventilators: 3,
      },
      {
        name: "Medical College",
        distance_km: 28,
        available_beds: 120,
        available_icu: 10,
        ventilators: 8,
      },
    ];

    const prompt = `
    You are an AI-powered Rural Healthcare Referral Optimization System.

    Patient Information:
    ${JSON.stringify(patientData, null, 2)}

    Available Hospitals:
    ${JSON.stringify(hospitals, null, 2)}

    Return STRICT JSON:
    {
      "recommended_hospital": "",
      "reasoning": "",
      "confidence": ""
    }
    `;

    const response = await axios.post(
      "https://ai.megallm.io/v1",
      {
        model: "mega-llm-model",
        messages: [
          {role: "system", content: "You are a medical referral engine."},
          {role: "user", content: prompt},
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization:
            `Bearer sk-mega-d225a92fce90ec9f00283e2ebc25d69cbc1faedda287ece2090189eebd0fb5f1`,
          "Content-Type": "application/json",
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});