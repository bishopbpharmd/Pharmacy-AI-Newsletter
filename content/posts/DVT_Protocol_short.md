+++  
date = '2025-10-01T22:32:56.183096'  
newsletter_edition = '2025-10-10T07:00:00-04:00'  
draft = false  
title = 'AI EHR Nudge to Prevent Hospital-Acquired Venous Thromboembolism (Protocol)'  
description = 'This pragmatic randomized trial will test an artificial intelligence–driven electronic health record nudge that prompts VTE prophylaxis for hospitalized adults at high predicted risk without an active order or documented contraindications. Conducted across urban and rural hospitals, it will compare the AI CDS to standard workflows on hospital-acquired VTE incidence, safety (bleeding), and process outcomes.'  
authors = 'Walsh CG, Long Y, Novak LL, et al.'  
journal = 'JAMA Network Open'  
doi = 'jamanetworkopen.2025.35137'  
tags = ["Predictive Real-World Deployment"]
type = 'minor'
+++  

## Summary  
Using a previously validated predictive model (C statistic 0.891; 95% CI, 0.882-0.900), the trial randomizes encounters with VTE-AI risk ≥3.6% to receive an orders-context OurPractice Advisory starting hospital day 2 versus standard care. The nudge supports ordering pharmacologic prophylaxis (e.g., enoxaparin; unfractionated heparin when neuraxial anesthesia; fondaparinux for heparin-induced thrombocytopenia) or documenting permanent/temporary contraindications, with daily prompts until an action is taken. Primary outcome is in-hospital HA-VTE; secondary outcomes include bleeding events, 30-day readmissions, and length of stay, with Poisson regression planned. Powering assumes a reduction in HA-VTE from 4.3% to 2.2% (n=2236 encounters total). The study incorporates “algorithmovigilance” by checking calibration and discrimination across subgroups (age, race/ethnicity, insurance) in the comparator arm and shares protocol/code publicly.
For pharmacy informatics, this is a real-world evaluation of targeted anticoagulant nudges embedded in admission and daily order workflows—key for minimizing alert fatigue while closing prophylaxis gaps. Build elements (risk thresholding, daily cadence, contraindication logic, and bleed surveillance) align with anticoagulation stewardship, formulary preferences, and safety monitoring; operational differences across urban/rural sites will inform how to standardize prophylaxis panels and documentation flows in enterprise EHRs.

---

## Citation  
Walsh CG, Long Y, Novak LL, et al. AI-Driven Clinical Decision Support to Reduce Hospital-Acquired Venous Thromboembolism: A Trial Protocol. JAMA Netw Open. 2025;8(10):e2535137. Published 2025 Oct 1. doi:10.1001/jamanetworkopen.2025.35137