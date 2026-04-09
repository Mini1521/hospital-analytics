# Hospital Patient Analytics and Re-admission Risk Predictor
> An end-to-end Data Science project combining Machine Learning and Business Intelligence, predicts hospital patient re-admission risk, and visualizes patient analytics through an interactive Power BI dashboard.

## Power BI Dashboard
<img width="745" height="492" alt="image" src="https://github.com/user-attachments/assets/61a405f7-2cef-4709-8547-b1698afb3761" />

## Flask Web App
<img width="587" height="588" alt="image" src="https://github.com/user-attachments/assets/67e6017b-1ed2-46b8-a63c-79270bdea89c" />


## What is being done:
### Part 1 - ML Web App
- Takes in a patient's profile (Age, condition, admission type, billing, length of stay)
- Runs it through a trained **Gradient Boosting classifier**
- Returns a **re-admission risk probability %** and **risk level** (High/Medium/Low)

### Part 2 - Power BI Dashboard
- Visualizes **10,000 patient records** across multiple dimensions
- KPIs: Total Patients, Avg Age, Avg Length of Stay, Avg Billing Amount
- Identifies high-risk patient segments by condition, age, and admission type
- Interactive slicers for filtering by Condition, Admission Type, and Gender

## Model Performance
| Model | Accuracy | ROC-AUC |
|---|---|---|
| Logistic Regression | ~78% | ~0.85 |
| Random Forest | ~82% | ~0.90 |
| **Gradient Boosting**  | **~84%** | **~0.91** |

> Best Model: **Gradient Boosting Classifier**
> Class imbalance handled with **SMOTE** oversampling

## Key EDA Findings
- **Emergency admissions** have the longest average length of stay
- **Cancer and Diabetes** patients have the highest re-admission risk
- **Billing amounts** are evenly distributed across insurance providers
- Patients aged **50-70** represent the highest risk group

## Tech Stack
## ⚙️ Tech Stack

| Layer | Tools |
|---|---|
| Data Processing | Python, Pandas, NumPy |
| Visualisation | Matplotlib, Seaborn, Power BI |
| Machine Learning | Scikit-learn, Imbalanced-learn |
| Backend | Flask, Joblib |
| Frontend | HTML, CSS, JavaScript |

## How to run locally 
**1. Clone the repo**
```bash
git clone https://github.com/YOUR_USERNAME/hospital-analytics.git
cd hospital-analytics
```

**2. Install dependencies**
```bash
pip install -r requirements.txt
```

**3. Train the model** *(skip if model.pkl already exists)*
```bash
jupyter notebook notebooks/02_Model.ipynb
```

**4. Run the Flask app**
```bash
cd app
python app.py
```

**5. Open in browser**
```
http://127.0.0.1:5000
```

---

##  Requirements

```
pandas
numpy
matplotlib
seaborn
scikit-learn
imbalanced-learn
flask
joblib
jupyter
```

## 📁 Dataset
- **Source:** [Kaggle - Healthcare Dataset](https://www.kaggle.com/datasets/prasad22/healthcare-dataset)
- **Size:** 10,000 patients, 15 features
- **Target:** `Test Results` → Abnormal (High Risk) vs Normal/Inconclusive
