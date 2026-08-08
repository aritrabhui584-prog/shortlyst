# Shortlyst — Demo Resume & Job Description Test Data

This folder contains **5 sample candidate resume PDFs** and **5 matching job descriptions** for test-driving Shortlyst's screening pipeline.

## 📁 Included Test Files

| Profile / Role | Resume PDF | Matching Job Description | Expected Score Range |
|---|---|---|:---:|
| **Frontend Developer** | `Alex_Rivera_Frontend_Engineer.pdf` | `jd-frontend.txt` | **9 - 10 / 10** |
| **Data Analyst** | `Elena_Rostova_Data_Analyst.pdf` | `jd-data-analyst.txt` | **8 - 9 / 10** |
| **Product Manager** | `Marcus_Chen_Product_Manager.pdf` | `jd-product-manager.txt` | **8 - 10 / 10** |
| **DevOps Engineer** | `Sarah_Jenkins_DevOps_Engineer.pdf` | `jd-devops.txt` | **8 - 10 / 10** |
| **UX Designer** | `David_Kim_UX_Designer.pdf` | `jd-ux-designer.txt` | **8 - 10 / 10** |

## 🧪 How to Run a Test Scan

1. Copy the contents of any `jd-*.txt` file and paste it into the **Job Description** field.
2. Drag and drop the corresponding candidate PDF resume (or drag all 5 resumes) into the **Upload Zone**.
3. Click **Screen Candidates** to watch Gemini parse and score the files in real time.
4. Try cross-screening: paste the **DevOps Job Description** but upload the **UX Designer Resume** to verify that Gemini evaluates matching scores correctly (scores should be under 4/10 with detailed reasoning).
