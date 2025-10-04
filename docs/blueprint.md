# **App Name**: ExoDetect: AI-Powered Exoplanet Discovery

## Core Features:

- Data Ingestion: Accept CSV uploads and manual entry of exoplanet parameters like orbital period, transit duration, planetary radius, transit depth, and SNR.
- NASA Data Integration: Utilize NASA's open datasets (Kepler, K2, TESS) for exoplanet model training.
- Feature Engineering: Clean, normalize, and handle missing data; extract key features for classification using a custom tool that decides which steps are required for best results.
- AI Model Training: Train a classification model (Random Forest, XGBoost, or Neural Network) to categorize celestial objects into 'Confirmed Exoplanet', 'Planetary Candidate', or 'False Positive'.
- Prediction & Visualization: Instantly display predicted class with a confidence score upon data input and show a precision, recall, F1-score, and confusion matrix.
- Exoplanet Simulation: Simulate a transit light curve showing brightness drop when a planet crosses a star.
- Model Explainability: Show feature importance or SHAP values to explain the model predictions using AI to evaluate when these values should be applied.

## Style Guidelines:

- Primary color: Deep space purple (#483D8B) evoking mystery and the cosmos.
- Background color: Dark gray (#222222) to enhance contrast and readability.
- Accent color: Electric blue (#7DF9FF) to highlight interactive elements and important data.
- Font pairing: 'Space Grotesk' (sans-serif) for headings, and 'Inter' (sans-serif) for body text. 'Source Code Pro' for displaying any code snippets.
- Use astronomy-themed icons (stars, planets, telescopes).
- A clean and modern layout with clear data visualization.
- Subtle animations during data processing and when displaying simulation of Exoplanet data.