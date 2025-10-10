+++  
date = '2025-09-30T00:00:00'  
newsletter_edition = '2025-10-10T07:00:00-04:00'  
draft = false  
title = 'Provider Trust and Workflow Challenges in AI Dosing'  
description = 'Healthcare providers’ perspectives on AI-guided dosing, including perceived benefits, barriers, and implications for pharmacy informatics.'  
authors = 'Sumner J, Mohamed Ali J, Motani M, et al.'  
journal = 'BMJ Health & Care Informatics'  
doi = '10.1136/bmjhci-2025-101461'  
tags = ["Predictive Process Outcomes"]  
type = 'major'  
+++  

## Clinical/Operational Question  
Key Question: What are healthcare providers’ perspectives on AI-guided precision dosing tools, and what barriers or facilitators do they identify for integrating such AI tools into the medication-use process across the hospital?

---

## Background  
- **Precision Dosing Challenges**: Tailoring medication doses to individual patient characteristics is complex and labor-intensive. Traditional one-size-fits-all dosing often misses the mark, especially for drugs with narrow therapeutic windows or variable pharmacokinetics (e.g., vancomycin, warfarin).  
- **Rise of AI in Dosing**: AI-driven algorithms like CURATE.AI analyze patient-specific data to recommend personalized doses, promising improved safety and dynamic therapy adjustment.  
- **Need for Acceptance**: Provider trust and usability are critical—poor CDS adoption history shows that without credibility and workflow fit, tools are ignored.  

---

## Methods Snapshot  
- **Design**: Qualitative interview study, analyzed via UTAUT framework.  
- **Participants**: 16 HCPs (9 physicians, 4 nurses, 3 pharmacists) at Alexandra Hospital, Singapore.  
- **Intervention**: CURATE.AI presented as a real-world example during semistructured interviews.  
- **Analysis**: Deductive coding + thematic analysis; focused on attitudes, usefulness, trust, and workflow conditions.  

---

## Results  
- **Attitudes**: Mixed optimism and caution; recognized potential benefits but significant reservations.  
- **Perceived Benefits**: Improved dosing precision, reduced adverse drug events, lower workload.  
- **Key Concerns**:  
  - Suitability for complex/atypical patients.  
  - Erosion of skills and critical thinking.  
  - Trust and transparency in “black box” algorithms.  
  - Liability and accountability for errors.  
  - Workflow integration challenges.  
- **Facilitators/Enablers**:  
  - Human-in-the-loop oversight.  
  - Transparency & explainability (clear rationale, confidence levels).  
  - Education & training (understanding data sources, validation).  
  - Technical robustness and reliability.  
  - Seamless workflow integration into EHR and pharmacy systems.  
- **Role-Specific Insights**:  
  - Physicians: valued cognitive relief but wary of autonomy/liability.  
  - Pharmacists: emphasized accuracy, data completeness, cross-checking.  
  - Nurses: focused on workflow fit, administration timing, safety.  

---

## Limitations & Generalizability  
- Single-site (Singapore) with 16 participants limits generalizability.  
- Potential selection bias (participants possibly tech-enthusiastic).  
- Hypothetical tool (CURATE.AI concept, not real-world experience).  
- UTAUT framework may constrain analysis.  
- Possible bias since researchers were linked to CURATE.AI development.  

---

## Applicability to Pharmacy Informatics  
- **Integration**: Ensure AI dosing aligns across prescribing, verification, dispensing, administration, and monitoring.  
- **CDS Hooks & FHIR**: Trigger AI in real time during order entry/modification.  
- **Advisories**:  
  - OPAs for passive display of AI dose.  
  - BPAs for significant deviations with context provided.  
- **Visual Flags**: Icons/flags to highlight discrepancies, enable feedback loops.  
- **Dispensing/Pyxis Integration**: Adjust stock configurations for AI-suggested doses.  
- **Administration**: Sync MAR, BCMA, and infusion pumps with AI adjustments.  
- **Monitoring Dashboards**: Track override rates, therapeutic outcomes, pharmacovigilance.  
- **Governance**: Establish update/validation workflows for AI models.  
- **Collaboration**: Multidisciplinary review (IT, data science, pharmacy, nursing).  
- **Training**: Education and quick-reference guides for all end-users.  

---

## Related Literature Synthesis  
- **Pharmacists and AI Dosing (Vancomycin, Liu et al., 2023)**: Enthusiasm tempered by low acceptance in practice; distrust, transparency gaps, poor EHR integration hindered uptake.  
- **Physician Perspectives (Vijayakumar et al., 2023)**: Physicians want oversight, transparency, proof of benefit; adoption evolves from tolerance in early trials to demand for seamless integration.  
- **Systematic Review (Henzler et al., 2025)**: Catalogued 43 barriers and 49 facilitators; barriers include autonomy concerns, skill atrophy, liability, privacy; facilitators include efficiency, improved decision-making, and leadership endorsement.  

---

## Citation  
Sumner J, Mohamed Ali J, Motani M, et al. Artificial intelligence guided dosing decisions: a qualitative study on health care provider perspectives. *BMJ Health & Care Informatics*. 2025;32(1):e101461. doi:10.1136/bmjhci-2025-101461

---

## References (Primary + Comparative Studies)  
1. Sumner J, Mohamed Ali J, Motani M, et al. AI-guided dosing decisions: a qualitative study on healthcare provider perspectives. *BMJ Health Care Inform*. 2025;32(1):e101461.  
2. Liu X, Barreto EF, Dong Y, et al. Discrepancy between perceptions and acceptance of CDSS: implementation of artificial intelligence for vancomycin dosing. *BMC Med Inform Decis Mak*. 2023;23(1):157.  
3. Vijayakumar S, Lee VV, Leong QY, et al. Physicians’ perspectives on AI in clinical decision support systems: Interview study of the CURATE.AI personalized dose optimization platform. *JMIR Hum Factors*. 2023;10:e48476.  
4. Henzler D, Schmidt S, Koçar A, et al. Healthcare professionals’ perspectives on AI in patient care: a systematic review of hindering and facilitating factors. *BMC Health Serv Res*. 2025;25(1):633.  
