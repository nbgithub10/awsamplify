#!/usr/bin/env python3
"""
Extract multiple choice questions from HSC Engineering Studies past papers
"""
import pdfplumber
import json
import re
import os

def extract_text_from_pdf(pdf_path):
    """Extract all text from a PDF file"""
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def extract_mc_questions(text, year):
    """Extract multiple choice questions from exam text"""
    questions = []
    
    # Pattern to match questions like "1" or "Q1" followed by question text and options A/B/C/D
    # This is a simplified pattern - we'll need to adjust based on actual format
    lines = text.split('\n')
    
    current_question = None
    current_options = []
    question_number = 0
    
    for i, line in enumerate(lines):
        line = line.strip()
        
        # Check if this is a question number (usually just a number at start of line)
        if re.match(r'^\d+$', line) and len(line) <= 3:
            # Save previous question if exists
            if current_question and len(current_options) == 4:
                questions.append({
                    'number': question_number,
                    'question': current_question,
                    'options': current_options,
                    'year': year
                })
            
            question_number = int(line)
            current_question = ""
            current_options = []
            continue
        
        # Check if this is an option (A, B, C, or D at start)
        option_match = re.match(r'^([A-D])\s+(.+)$', line)
        if option_match and current_question:
            current_options.append(option_match.group(2).strip())
            continue
        
        # Otherwise, add to current question text
        if current_question is not None and not option_match:
            if line:  # Only add non-empty lines
                current_question += " " + line
    
    # Don't forget the last question
    if current_question and len(current_options) == 4:
        questions.append({
            'number': question_number,
            'question': current_question.strip(),
            'options': current_options,
            'year': year
        })
    
    return questions

def extract_mc_answers(text, year):
    """Extract multiple choice answers from marking guidelines"""
    answers = {}
    
    # Look for answer patterns like "1 B" or "Question 1: B"
    lines = text.split('\n')
    
    for line in lines:
        # Pattern: "1    B" or "1 B" or "Question 1  B"
        match = re.search(r'(?:Question\s+)?(\d+)\s+([A-D])', line, re.IGNORECASE)
        if match:
            q_num = int(match.group(1))
            answer = match.group(2).upper()
            answers[q_num] = answer
    
    return answers

def main():
    past_papers_dir = "past-papers"
    years = [2020, 2021, 2022, 2024, 2025]
    
    all_questions = []
    
    for year in years:
        exam_file = f"{past_papers_dir}/{year}-hsc-engineering-studies.pdf"
        mg_file = f"{past_papers_dir}/{year}-hsc-engineering-studies-mg.pdf"
        
        # Handle 2025 special naming
        if year == 2025:
            mg_file = f"{past_papers_dir}/{year}-hsc-engineering-studies-mg_0.pdf"
        
        if not os.path.exists(exam_file):
            print(f"Skipping {year} - exam file not found")
            continue
            
        print(f"\nProcessing {year}...")
        
        # Extract questions from exam paper
        exam_text = extract_text_from_pdf(exam_file)
        questions = extract_mc_questions(exam_text, year)
        print(f"  Found {len(questions)} questions in exam paper")
        
        # Extract answers from marking guidelines
        if os.path.exists(mg_file):
            mg_text = extract_text_from_pdf(mg_file)
            answers = extract_mc_answers(mg_text, year)
            print(f"  Found {len(answers)} answers in marking guidelines")
            
            # Match answers to questions
            for q in questions:
                if q['number'] in answers:
                    # Convert letter to index (A=0, B=1, C=2, D=3)
                    answer_letter = answers[q['number']]
                    q['correctAnswer'] = ord(answer_letter) - ord('A')
                    q['correctAnswerLetter'] = answer_letter
        
        all_questions.extend(questions)
    
    # Save to JSON
    output_file = "extracted_questions.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Extracted {len(all_questions)} total questions")
    print(f"✓ Saved to {output_file}")
    
    # Print sample
    if all_questions:
        print("\nSample question:")
        sample = all_questions[0]
        print(f"Year: {sample['year']}")
        print(f"Q{sample['number']}: {sample['question'][:100]}...")
        print(f"Options: {sample['options']}")
        if 'correctAnswer' in sample:
            print(f"Answer: {sample['correctAnswerLetter']} ({sample['correctAnswer']})")

if __name__ == "__main__":
    main()
