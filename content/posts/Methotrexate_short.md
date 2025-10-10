+++  
date = '2025-09-17T23:07:00.657521'  
newsletter_edition = '2025-10-10T07:00:00-04:00'  
draft = false  
title = 'Predicting Delayed Clearance in Pediatric High-Dose Methotrexate'  
description = 'In 1,485 pediatric high-dose methotrexate cycles, a machine learning model predicted delayed excretion with strong discrimination; XGBoost performed best (AUROC 0.842) and high specificity. An eight-variable model—driven most by serum creatinine and total dose—was released as a web tool for pre-cycle risk stratification to guide supportive care intensity.'  
authors = 'Zhou C, Qian Y, Xue Y, et al.'  
journal = 'Frontiers in Pharmacology'  
doi = '10.3389/fphar.2025.1662718'  
tags = ["Predictive Model Development"]
type = 'minor'
+++  

## Summary  
This single-center retrospective study modeled each chemotherapy cycle as an independent unit and defined delayed excretion as methotrexate >1 μmol/L at 48 h or ≥0.2 μmol/L at 72 h (26.1% of cycles). From demographic, dosing, and routine labs, eight features emerged (serum creatinine, total dose, alkaline phosphatase, creatine kinase, urea, gamma-glutamyl transferase, hemoglobin, height). Among four algorithms, XGBoost achieved the best internal performance via 1,000-bootstrapped validation: AUROC 0.842 (95% CI 0.815–0.873), accuracy 0.780, sensitivity 0.577, specificity 0.907, F1 0.669, Brier 0.136; decision curve analysis suggested net benefit across ~10%–80% thresholds (best to ~75%). SHAP interpretation highlighted serum creatinine as the dominant contributor, with higher creatinine and dose, and lower alkaline phosphatase increasing risk. A sensitivity analysis using only the first cycle per patient showed similar performance. 

For pharmacy operations, the model’s inputs are standard pre-cycle data, enabling incorporation into order verification or treatment planning to flag high-risk cycles before infusion, prompting considerations such as intensified hydration/alkalinization and earlier leucovorin escalation per protocol, closer MTX level monitoring, and proactive review of potential interacting medications. Important caveats for informatics teams: results are from one institution with internal validation only; key clinical drivers (drug interactions, urine output and pH, genetics, hydration specifics) were not modeled, and sensitivity is modest—so the tool should augment, not replace, pharmacist judgment, and requires external/prospective evaluation before broad deployment.

---

## Citation  
Zhou C, Qian Y, Xue Y, et al. Risk factor identification for delayed excretion in pediatric high-dose methotrexate therapy: a machine learning analysis of real-world data. Front Pharmacol. 2025;16:1662718. Published 2025 Sep 17. doi:10.3389/fphar.2025.1662718