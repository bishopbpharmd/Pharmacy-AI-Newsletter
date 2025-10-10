+++  
date = '2025-10-07T00:00:00'  
newsletter_edition = '2025-10-10T07:00:00-04:00'  
draft = false  
title = 'Streamlining Structured Notes with NLP Integration'  
description = 'This study evaluates MiADE, an open-source NLP system integrated into Epic to convert clinical notes into structured data, aiming to improve documentation completeness and reduce clinician burden.'  
authors = 'Jiang-Kells J, Brandreth J, Zhu L, et al.'  
journal = 'BMC Medical Informatics and Decision Making'  
doi = '10.1186/s12911-025-03195-1'  
tags = ["Predictive Real-World Deployment", "Predictive Model Development"]  
type = 'major'  
+++  

## Clinical/Operational Question  
In a hospital EHR setting, does integrating a real-time NLP tool (MiADE) that extracts key data from clinical notes improve the completeness of structured records (problem lists, medication/allergy lists) and reduce documentation time compared to standard manual entry?  

---

## Background & Rationale  
**Importance of Structured Data**: Structured EHR data is critical for safety alerts, CDS, and research, yet much remains buried in free-text notes (~62% of inpatient diagnoses appeared on the coded problem list).  

**Data Entry Burden**: Coding entries is time-consuming, leading to incomplete documentation and clinician frustration.  

**NLP as a Solution**: MiADE automates conversion of notes to structured entries, potentially improving data quality and efficiency.  

---

## Methods Snapshot  
- **Design & Integration**: MiADE integrates with Epic via HL7 CDA (NoteReader), returning suggestions directly in the EHR.  
- **NLP Engine**: Built on MedCAT for NER and SNOMED CT linking; MetaCAT for context classification.  
- **Training**: Models trained on ~800,000 UCLH notes, fine-tuned with local annotations.  
- **Evaluation**: Accuracy assessed vs. annotated discharge summaries; simulation of problem entry; 10-week pilot deployment.  

---

## Key Results  
- **NER Performance**: Precision ~83%, Recall ~85%.  
- **Time Savings**: Problem entry reduced by 89% (132s → 14s).  
- **Structured Data Capture**: 1,645 notes processed; 317 concepts added to 111 patient records.  
- **Operational Outcomes**: Successful integration with clinician validation.  

---

## Strengths / Limitations  
**Strengths**  
- Real-time EHR integration.  
- Open-source, modular design.  
- Human-in-loop validation ensures safety.  

**Limitations**  
- Medication/allergy modules not fully deployed.  
- Contextual nuance challenges (false positives).  
- Site-specific customization required.  
- Limited evidence level (no RCTs, short-term pilot).  

---

## AI-Specific Considerations  
- **Data Representativeness**: Trained on single-site data; generalizability uncertain.  
- **Transparency**: Highlights terms for user validation; no confidence scoring.  
- **Bias**: No systematic evaluation of demographic impacts.  
- **Choice of Methods**: Domain-specific NLP over LLMs for reliability and feasibility.  

---

## Applicability to Pharmacy Informatics  
- **Enhanced Medication Reconciliation**: Detect undocumented therapies/allergies in notes.  
- **Epic Willow Impact**: Improved CDS via more complete problem/allergy lists.  
- **Streamlining Review**: Reduces pharmacist time scanning notes.  
- **Medication Safety**: Supports indication-based prescribing and monitoring high-risk conditions.  

---

## Related Literature Synthesis  
- **PheNominal (2022)**: NLP-assisted structured phenotype capture; 67% time savings.  
- **Problem List CDS (2023)**: Rule-based AI improved list completeness; 22% of 288k suggestions accepted.  
- **CogStack (2022)**: Enterprise NLP platform at UCLH; scaled to 30M+ notes for multiple applications.  

---

## Evidence Quality & Recommendation  
- **Evidence Quality**: Low (single-site, observational, surrogate outcomes).  
- **Recommendation**: Conditional support for pilot use; strong efficiency gains justify cautious implementation with local validation and monitoring.  

---

## Bottom Line  
NLP at the point of care can substantially improve documentation efficiency and completeness. MiADE demonstrates feasibility within Epic, offering pharmacists better data for CDS and medication reconciliation. Success hinges on local customization, safety checks, and phased deployment.  

---

## Citation  
Jiang-Kells J, Brandreth J, Zhu L, Ross J, Jani Y, Shah A. Design and implementation of a natural language processing system at the point of care: MiADE (medical information AI data extractor). *BMC Med Inform Decis Mak.* 2025;25:365. doi:10.1186/s12911-025-03195-1  

---

## References (Primary + Comparative Studies)  
1. Jiang-Kells J, Brandreth J, Zhu L, Ross J, Jani Y, Shah A. Design and implementation of a natural language processing system at the point of care: MiADE (medical information AI data extractor). *BMC Med Inform Decis Mak.* 2025;25(1):365. doi:10.1186/s12911-025-03195-1  
2. Havrilla JM, Singaravelu A, Driscoll DM, Minkovsky L, Helbig I, et al. PheNominal: an EHR-integrated web application for structured deep phenotyping at the point of care. *BMC Med Inform Decis Mak.* 2022;22(Suppl 2):198. doi:10.1186/s12911-022-01927-1  
3. Wright A, Schreiber R, Bates DW, Aaron S, Ai A, Cholan RA, et al. A multi-site randomized trial of a clinical decision support intervention to improve problem list completeness. *J Am Med Inform Assoc.* 2023;30(5):899-906. doi:10.1093/jamia/ocad020  
4. Noor K, Roguski L, Bai X, Handy A, Klapaukh R, Folarin A, et al. Deployment of a free-text analytics platform at a UK NHS hospital: CogStack at University College London Hospitals. *JMIR Med Inform.* 2022;10(8):e38122. doi:10.2196/38122  
