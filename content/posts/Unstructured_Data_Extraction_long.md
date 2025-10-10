+++
date = '2025-10-02T00:00:00Z'
newsletter_edition = '2025-10-10T07:00:00-04:00'
draft = false
title = 'Unlocking Clinical Notes: Structured Data Extraction for CDS and Research'
description = 'This JMIR Cancer 2025 study evaluated GPT-3.5, GPT-4o, Llama 3.2, Gemini 1.5, and BioBERT for categorizing oncology diagnoses from structured ICD-10 codes and free-text EHR notes into 14 categories, highlighting both potential and risks of LLM-based structuring of clinical data.'
authors = 'Hashtarkhani S, Rashid R, Brett CL, et al.'
journal = 'Journal of Medical Internet Research: JMIR Cancer'
doi = '10.2196/72005'
tags = ["Predictive Model Development"]
type = 'major'
+++

## Background and Objective
Electronic health records (EHRs) contain large amounts of unstructured text (e.g., clinician notes, free-text diagnoses) that are labor-intensive to preprocess for use in predictive models. This study evaluated the performance of four large language models (GPT-3.5, GPT-4o, Llama 3.2, Gemini 1.5) and a biomedical transformer (BioBERT) in classifying cancer diagnoses into 14 oncology-relevant categories. Models were tested on structured ICD-10 code descriptions and free-text diagnosis entries to assess feasibility for automating data structuring for clinical decision support.

---

## Methods
- **Dataset:** 3,456 cancer patient records (2017–2021) from a single radiation oncology institution; 762 unique diagnoses (326 ICD-10 codes, 436 free-text notes).
- **Categories:** 14 oncology categories (e.g., Breast, Lung/Thoracic, CNS, Metastasis, Benign).
- **Models:**  
  - GPT-3.5 (OpenAI)  
  - GPT-4o (OpenAI omni)  
  - Llama 3.2 (Meta, open-source)  
  - Gemini 1.5 (Google)  
  - BioBERT (fine-tuned on dataset, 3 epochs)  
- **Evaluation:** Zero-shot prompting for LLMs, fine-tuning for BioBERT. Metrics: accuracy and weighted F1-score with 95% bootstrapped CIs. Error analysis identified misclassification patterns.

---

## Key Results
- **ICD-coded diagnoses:**  
  - BioBERT highest (accuracy 90.8%, F1 84.2%).  
  - GPT-4o close second (accuracy 90.8%, F1 81.2%).  
  - GPT-3.5 lower F1 (61.6%) despite good accuracy (88.9%).  
  - Gemini and Llama trailed (~77–81% accuracy).  
- **Free-text diagnoses:**  
  - GPT-4o best performer (accuracy 81.9%, F1 71.8%).  
  - BioBERT similar accuracy (81.6%) but lower F1 (61.5%).  
  - GPT-3.5 dropped to 75.9% accuracy, F1 52.5%.  
  - Gemini/Llama struggled (accuracy ~64%, F1 44–52%).  
- **Error patterns:**  
  - Benign misclassified as malignant due to ICD wording gaps.  
  - Metastasis often mislabeled as primary cancers.  
  - “Unknown” vague cases over-predicted as specific cancers.  
- **Operational aspects:** Cloud APIs (GPT, Gemini) vs local (Llama, BioBERT). Integration into Python pipelines feasible but resource/cost considerations noted.

---

## Authors’ Conclusions
- LLMs and BioBERT show strong potential for structuring EHR data.  
- BioBERT excels at standardized text; GPT-4o competitive on free-text.  
- Current performance (~81–91% accuracy) is promising but not safe for autonomous clinical decision support.  
- Recommended hybrid approach: automate routine categorization while flagging ambiguous/low-confidence cases for human review.  
- Limitations: single institution, oncology-only dataset, custom categories, limited generalizability.  
- Urges validation across multi-center datasets and implementation of safeguards (confidence thresholds, human-in-loop).

---

## Implications for Clinical Informatics
- **Unlocking Unstructured Data:** LLMs can transform narrative notes into structured inputs for CDS, registries, and risk models.  
- **Caution in CDS:** Misclassifications (e.g., metastasis vs benign) could lead to harmful CDS alerts.  
- **Vendor-Agnostic Integration:** Feasible via Python pipelines and FHIR APIs, avoiding proprietary lock-in.  
- **Monitoring:** Continuous oversight, bias audits, retraining needed to maintain accuracy and fairness.  
- **Ethical Considerations:** Liability, transparency, and bias risks highlight the need for human oversight.  

---

## Comparative Context
Other recent studies support findings:  
- **Bürgisser 2024:** Llama 2 achieved 95% accuracy detecting gout from French notes, outperforming regex.  
- **Du 2025:** Systematic review (196 studies) highlights widespread LLM use in CDS, but need for standardized evaluation.  
- **Guevara 2024:** Fine-tuned models outperformed GPT in extracting social determinants of health, capturing context missed by ICD codes.

---

## Citation
Hashtarkhani S, et al. *Cancer diagnosis categorization in EHRs using large language models and BioBERT: model performance evaluation study.* JMIR Cancer. 2025;11:e72005. doi:10.2196/72005

---

## References (Primary + Comparative Studies)
1. Hashtarkhani S, et al. JMIR Cancer. 2025;11:e72005. doi:10.2196/72005  
2. Bürgisser N, et al. RMD Open. 2024;10(4):e005003. doi:10.1136/rmdopen-2023-005003  
3. Du X, et al. Int J Med Inform. 2025;205:106091. doi:10.1016/j.ijmedinf.2025.106091  
4. Guevara M, et al. npj Digit Med. 2024;7(1):6. doi:10.1038/s41746-023-00970-0  
5. Ford E, et al. J Am Med Inform Assoc. 2016;23(5):1007–15. doi:10.1093/jamia/ocw041  
