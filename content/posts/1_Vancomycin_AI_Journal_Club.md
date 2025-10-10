+++
date = '2025-10-03T11:38:37-04:00'
newsletter_edition = '2025-10-03T07:00:00-04:00'
draft = false
title = 'Deep Learning Model for the Prediction of Vancomycin Trough Concentration'
description = 'Evaluation of Nephrocast-V, a sequential deep learning model predicting vancomycin trough concentrations in ICU patients, benchmarked against pharmacist-driven Bayesian dosing.'
authors = 'Ghanbari G, Stevens C, Aronoff-Spencer E, Malhotra A, Nemati S, Yousif Z.'
journal = 'Pharmacotherapy'
doi = '10.1002/phar.70062'
tags = ['Model Development']
type = 'major'
+++

## Clinical/Operational Question  
Can a sequential deep learning model (“Nephrocast-V”) accurately forecast vancomycin trough levels ~48 hours ahead in ICU patients and recommend dose adjustments to attain therapeutic levels, compared to standard pharmacist-driven Bayesian dosing?  

---

## Background & Rationale  
**TDM Challenge:** Only ~34% of critically ill patients reach therapeutic vancomycin levels in the first 48h of therapy (under 40% by day 3). Traditional Bayesian dosing models use limited covariates and assume stable renal function—assumptions often violated in ICU (e.g., rapid AKI changes).  

**Need for Precision:** Guidelines endorse AUC-guided dosing (target AUC/MIC 400–600) via Bayesian tools, but implementation is labor-intensive and not universally adopted. Pharmacist-led dosing improves outcomes yet requires time-intensive individualization.  

**AI Potential:** Machine learning can learn from high-dimensional EHR data and capture complex PK dynamics. Prior vancomycin ML models showed improved accuracy over PopPK but had limitations—short windows, no direct comparison to clinicians, or only initial troughs. Nephrocast-V addresses these by predicting 48h ahead and benchmarking against pharmacists.  

---

## Methods Snapshot  
- **Design/Setting:** Retrospective single-center cohort at two UCSD ICUs (Jan 2016–Jun 2024).  
- **Inclusion:** Adult ICU patients ≥24h, intermittent IV vancomycin.  
- **Exclusions:** Continuous infusions, RRT within 7d, ICU stay >14d.  
- **Outcome:** Steady-state trough ~2 days after prediction point.  
- **Model:** LSTM + 2-head attention + dense layer with skip connections.  
- **Predictors:** 253 EHR variables—demographics, comorbidities, labs, vitals, meds, prior vanco levels, doses between prediction and trough.  
- **Comparison:** ICU pharmacists using PrecisePK Bayesian software.  
- **Dose Adjustment Simulation:** Incremental ±250mg adjustments tested.  

---

## Key Results  
- **Cohort:** 2,205 ICU vancomycin encounters (~2,492 troughs). Median age 58; 64% male; 44% experienced AKI.  
- **Prediction Accuracy:** MAE 3.15 mg/L, RMSE 4.17 mg/L—comparable to pharmacists (MAE 3.06, RMSE 4.07).  
- **Therapeutic Range Classification:** Both model and pharmacists ~56% accuracy in categorizing troughs.  
- **High-Error Scenarios:** AKI onset/recovery, low muscle mass, obesity, very low baseline SCr.  
- **Key Feature Drivers:** Current dose most influential, followed by SCr, length of stay, lab values, sex, sepsis/SIRS indicators.  
- **Dose Recommendations:** Closer alignment with Nephrocast-V dosing associated with more therapeutic troughs.  

---

## Strengths  
- Large real-world ICU dataset (≈2.5k troughs, >2k encounters).  
- Broad inputs beyond PopPK models.  
- Modern architecture (LSTM + attention, skip connections).  
- Benchmark against pharmacists with Bayesian software.  
- Actionable dose recommendations, not just predictions.  
- Thorough error analysis and feature importance transparency.  

---

## Limitations  
- Single-center, internal validation only.  
- Excluded dialysis and prolonged ICU cases.  
- Trough-focused despite AUC guideline emphasis.  
- Retrospective—no prospective patient outcomes.  
- Semi-structured data extraction may introduce bias.  
- Mostly adult/White cohort; pediatric/ethnic subgroup performance unknown.  

---

## AI-Specific Considerations  
- **Training/Generalizability:** Local UCSD data only; external validation needed.  
- **Explainability:** Gradient-based importance aligned with clinical logic, but SHAP/interpretability tools recommended.  
- **Bias & Fairness:** Possible subgroup differences (e.g., sex, ICU type).  
- **Regulatory Oversight:** Likely CDS under FDA regulation if logic opaque.  
- **Maintenance:** Risk of model drift—requires periodic re-training.  

---

## Applicability to Pharmacy Informatics  
- Integration via CDS Hooks or SMART-on-FHIR (e.g., during order verification).  
- Workflow fit: EMR side-panel, BPA, or dosing advisor.  
- Data pipeline: HL7/FHIR mapping of SCr, dosing history, labs.  
- Alerting: Non-intrusive, rationale-based to avoid fatigue.  
- Training & Acceptance: Scope/limits education, pilot phase trials.  
- Governance: Override logging, pharmacist review, continuous QI.  

---

## Related Literature Synthesis Table  

**[A] Hu et al. 2025 (Front Pharmacol)**  
- Random Forest vs PopPK for troughs (n=546).  
- Achieved 84% accuracy vs Bayesian 57%.  
- No dose recommendations; short prediction horizon.  
- **Takeaway:** Even simple ML > PopPK; supports AI in trough targeting.  

**[B] Chen et al. 2025 (Microbiol Spectr)**  
- ICU sepsis cohort (n=4,059). Compared PopPK, Bayesian, ML, Hybrid PK+ML.  
- Hybrid best without drug levels; Bayesian best with trough data.  
- **Takeaway:** Optimal approach context-dependent; future CDS may dynamically select method.  

**[C] Nigo et al. 2022 (J Biomed Inform)**  
- PK-RNN-V<sup>E</sup>, deep learning on 55k vanco levels.  
- Outperformed Bayesian RMSE 5.39 vs 6.29 mg/L.  
- Did not provide dosing adjustments.  
- **Takeaway:** Early validation of RNN-based AI in vancomycin; Nephrocast-V extends horizon + attention.  

---

## Evidence Quality & Recommendation  
- **GRADE:** Low (retrospective, single-site, indirect outcomes).  
- **Practice Recommendation:** Do not replace pharmacist judgment yet. Use as adjunct in pilot studies with oversight.  
- **Discussion Prompt:** What safeguards would you want before trusting AI dosing in ICU?  

---

## Bottom Line  
Nephrocast-V predicted vancomycin troughs ~48h ahead with pharmacist-level accuracy in ICU patients. It leverages rich EHR data, offers dose recommendations, and could enhance dosing precision where PopPK models fall short.  

Before clinical adoption: external validation, workflow integration, and governance structures are needed. Pharmacists remain central to evaluating and applying AI outputs safely.  

---

## Citation  
Ghanbari G, Stevens C, Aronoff-Spencer E, Malhotra A, Nemati S, Yousif Z. Nephrocast-V: A Deep Learning Model for the Prediction of Vancomycin Trough Concentration Using Electronic Health Record Data. *Pharmacotherapy*. 2025. doi:10.1002/phar.70062  

---

## References (Primary + Comparative Studies)  
1. Ghanbari G, Stevens C, Aronoff-Spencer E, Malhotra A, Nemati S, Yousif Z. *Pharmacotherapy*. 2025. doi:10.1002/phar.70062  
2. Hu T, Ding X, Han F, An Z. *Front Pharmacol*. 2025;16:1549500. doi:10.3389/fphar.2025.1549500  
3. Chen K, Wang C, Wei Y, Ma S, Huang W, Dong Y, et al. *Microbiol Spectr*. 2025;13(5):e0049925. doi:10.1128/spectrum.00499-25  
4. Nigo M, Tran HTN, Xie Z, Feng H, Mao B, Rasmy L, et al. *J Biomed Inform*. 2022;133:104166. doi:10.1016/j.jbi.2022.104166  