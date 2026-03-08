#!/usr/bin/env python3
"""
Extract raw text from PDFs to see structure
"""
import pdfplumber
import os

def extract_pdf_to_text(pdf_path, output_path):
    """Extract all text from a PDF and save to file"""
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages, 1):
            text += f"\n{'='*60}\nPAGE {page_num}\n{'='*60}\n"
            text += page.extract_text() + "\n"
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(text)
    
    print(f"Extracted {pdf_path} -> {output_path}")

def main():
    past_papers_dir = "past-papers"
    output_dir = "extracted-text"
    os.makedirs(output_dir, exist_ok=True)
    
    # Extract just one year to start
    year = 2025
    
    files = [
        f"{past_papers_dir}/{year}-hsc-engineering-studies.pdf",
        f"{past_papers_dir}/{year}-hsc-engineering-studies-mg_0.pdf"
    ]
    
    for pdf_file in files:
        if os.path.exists(pdf_file):
            basename = os.path.basename(pdf_file).replace('.pdf', '.txt')
            output_file = f"{output_dir}/{basename}"
            extract_pdf_to_text(pdf_file, output_file)

if __name__ == "__main__":
    main()
