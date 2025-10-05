+++
date = '2025-10-04T11:34:58-04:00'
draft = false
title = 'Evaluation of Explainable AI Frameworks in Healthcare'
description = 'Evaluation of multiple explainable AI methods (local and global) in healthcare using the XAI-Eval framework to assess fidelity, stability, complexity, and trustworthiness of clinical predictions.'
authors = 'Agrawal K, El Shawi R, Ahmed N.'
journal = 'Digital Health'
doi = '10.1177/20552076251368045'
tags = ['Guidelines & Standards']
type = 'major'
+++

## Clinical/Operational Question  
**Question:** In healthcare machine learning, how do widely used explanation techniques (local and global) compare in their ability to provide trustworthy, useful explanations for clinical predictions, and how can we systematically evaluate these methods in real-world settings?  

---

## Background & Rationale  
Why it matters: AI-driven decision support in medication management and clinical care must be explainable to earn clinician trust and meet safety/regulatory requirements. Pharmacy informatics teams integrating AI (e.g., into Epic EHR alerts or dosing tools) face a critical need for transparent algorithms so pharmacists understand and validate AI recommendations before acting. Multiple eXplainable AI (XAI) methods (LIME, SHAP, Anchors, rule-based models, etc.) exist, but it’s unclear which is optimal for a given clinical task. High-stakes environments like EHR medication ordering and CDS demand rigorous evaluation of explainability – poor explanations can erode user confidence or hide biases, whereas robust explanations can improve acceptance and oversight of AI-driven alerts. This study addresses the gap by proposing a framework to quantitatively compare XAI methods on healthcare data, guiding informatics teams in choosing the right approach for safe, transparent AI deployment.  

---

## Methods Snapshot  
- **Design:** Comparative in silico evaluation of XAI techniques using retrospective clinical datasets (multiple healthcare prediction tasks).  
- **XAI Methods:** Five local explainers (LIME, CIU, RuleFit, RuleMatrix, Anchors) and four global explainers (LIME, Anchors, RuleFit, RuleMatrix).  
- **Data:** Diverse healthcare datasets across diagnostic and prognostic tasks.  
- **Evaluation Metrics:** Fidelity, stability/robustness, complexity/simplicity, monotonicity, non-sensitivity.  
- **Analysis:** Quantitative comparisons of local and global methods across datasets.  

---

## Key Results  
- No single XAI method dominated every metric.  
- **Global explanations:** RuleFit and RuleMatrix were most interpretable and faithful.  
- **Local explanations:** Rule-based methods excelled in stability and fidelity; CIU best at monotonicity; LIME weakest on monotonicity but avoided irrelevant features.  
- **Trade-offs:** Simpler methods (LIME) offered interpretability but reduced fidelity; higher fidelity approaches tended to be more complex.  
- **Implication:** Context-dependent selection is necessary based on clinical priorities.  

---

## Strengths and Limitations  

### Strengths  
- Comprehensive head-to-head comparison of multiple methods.  
- Structured framework with standardized metrics.  
- Real-world healthcare datasets (not synthetic).  
- Pragmatic, actionable guidance with no conflicts of interest.  

### Limitations  
- Did not include some popular methods (e.g., SHAP, counterfactuals).  
- Lacked user/clinician validation.  
- Retrospective only; no live EHR deployment tested.  
- Domain-specific nuances may require re-testing.  

---

## AI-Specific Considerations  
- **Transparency & Trust:** Balancing clarity and completeness is key. High-fidelity and stability crucial for clinician trust.  
- **Generalizability:** Rule-based global methods showed robustness, but site-specific testing required.  
- **Bias & Fairness:** Explanations may reveal or obscure bias; fairness must be evaluated alongside explainability.  

---

## Applicability to Pharmacy Informatics  
- **Epic Willow & Pyxis ES:** Rule-based global explanations (RuleFit/RuleMatrix) can integrate as interpretable rules for pharmacists.  
- **FHIR CDS Hooks:** Explanations can be embedded in alerts to improve trust.  
- **Clinical Alerting Systems:** XAI-Eval framework can optimize alerts, reduce fatigue, and ensure new predictive alerts come with understandable justifications.  

---

## Related Literature Synthesis  
- **Qureshi et al., 2025:** SHAP achieved perfect fidelity for tree models; LIME simpler but less faithful. Reinforces that context matters.  
- **Liu et al., 2024:** Applied XAI to Epic alerts, generating actionable changes that reduced ~9% of irrelevant alerts.  
- **Noor et al., 2025:** Review of XAI in healthcare highlighted the need for standardized evaluation and clinical integration, echoing XAI-Eval’s importance.  

---

## Evidence Quality & Recommendation  
- **Evidence Quality:** Moderate certainty. Strong technical evidence across multiple datasets, but no patient outcomes.  
- **Recommendation:** Strongly recommend pharmacy informatics teams adopt an evaluation framework (like XAI-Eval) when implementing AI-driven CDS, especially in medication safety contexts.  

---

## Bottom Line  
- Select explanation methods as carefully as predictive models.  
- Use XAI-Eval or similar frameworks to vet methods before deployment.  
- Integrate explanations into workflow (e.g., Epic alerts) to improve trust and reduce alert fatigue.  
- Transparency = Safety: Explainable AI supports safer pharmacy decision-making.  

---

## Citation  
Agrawal K, El Shawi R, Ahmed N. eXplainable artificial intelligence-Eval: A framework for comparative evaluation of explanation methods in healthcare. Digit Health. 2025;11:20552076251368045. DOI: 10.1177/20552076251368045  

---

## References (Primary + Comparative Studies)  
1. Agrawal K, El Shawi R, Ahmed N. eXplainable artificial intelligence-Eval: A framework for comparative evaluation of explanation methods in healthcare. Digit Health. 2025;11:20552076251368045. DOI: 10.1177/20552076251368045  
2. Qureshi MA, Noor AA, Manzoor A, et al. Explainability in Action: A Metric-Driven Assessment of Five XAI Methods for Healthcare Tabular Models. medRxiv. 2025 May 20;2025.05.20.25327976. DOI: 10.1101/2025.05.20.25327976  
3. Liu S, McCoy AB, Peterson JF, et al. Leveraging explainable artificial intelligence to optimize clinical decision support. J Am Med Inform Assoc. 2024;31(4):968-974. DOI: 10.1093/jamia/ocae019  
4. Noor AA, Manzoor A, Qureshi MDM, et al. Unveiling Explainable AI in Healthcare: Current Trends, Challenges, and Future Directions. Wiley Interdiscip Rev Data Min Knowl Discov. 2025;15(4):e70018. DOI: 10.1002/widm.70018  