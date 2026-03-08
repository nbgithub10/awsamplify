#!/usr/bin/env python3
"""
HSC Engineering Studies Past Papers Question Extractor
"""

import os
import re
import json
import PyPDF2

PAST_PAPERS_DIR = "past-papers"
EXTRACTED_TEXT_DIR = "extracted-text"
OUTPUT_FILE = "past_papers_questions.json"
YEARS = [2020, 2021, 2022, 2024, 2025]


def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
    except Exception as e:
        print(f"Error: {e}")
    return text


def save_extracted_text(text, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(text)


def extract_answers_from_marking_guide(text):
    answers = {}
    lines = text.split('\n')
    in_answer_section = False
    
    for line in lines:
        # More flexible matching for answer key section
        if re.search(r'Multiple.*choice.*Answer.*Key', line, re.IGNORECASE) or re.search(r'Question.*Answer', line, re.IGNORECASE):
            in_answer_section = True
            continue
        
        if in_answer_section:
            # Match patterns like "1 C", "2 B", etc. (with optional extra spaces)
            match = re.match(r'^(\d+)\s+([A-D])\s*$', line.strip())
            if match:
                question_num = int(match.group(1))
                answer = match.group(2)
                if 1 <= question_num <= 20:
                    answers[question_num] = answer
            
            if len(answers) >= 20:
                break
    
    return answers


def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'–\s*\d+\s*–', '', text)
    return text.strip()


def extract_questions_from_exam(text):
    questions = {}
    lines = text.split('\n')
    
    for q_num in range(1, 21):
        q_start_idx = -1
        for i, line in enumerate(lines):
            stripped = line.strip()
            if re.match(rf'^{q_num}\s+', stripped) or stripped == str(q_num):
                q_start_idx = i
                break
        
        if q_start_idx == -1:
            continue
        
        q_end_idx = len(lines)
        for i in range(q_start_idx + 1, len(lines)):
            line = lines[i].strip()
            if q_num < 20:
                if re.match(rf'^{q_num + 1}\s+', line) or line == str(q_num + 1):
                    q_end_idx = i
                    break
            if 'Section II' in line:
                q_end_idx = i
                break
        
        question_block = '\n'.join(lines[q_start_idx:q_end_idx])
        question_block = re.sub(rf'^{q_num}\s*', '', question_block, count=1)
        
        options = {}
        for letter in ['A', 'B', 'C', 'D']:
            if letter == 'D':
                pattern = rf'{letter}[\.:\)]\s*(.+?)(?=\n*$)'
            else:
                next_letter = chr(ord(letter) + 1)
                pattern = rf'{letter}[\.:\)]\s*(.+?)(?={next_letter}[\.:\)])'
            
            match = re.search(pattern, question_block, re.DOTALL)
            if match:
                options[letter] = clean_text(match.group(1))
        
        if len(options) == 4:
            first_opt = min(
                question_block.find(f'{c}.') if question_block.find(f'{c}.') >= 0 else 999999
                for c in ['A', 'B', 'C', 'D']
            )
            if first_opt < 999999:
                question_text = clean_text(question_block[:first_opt])
                if len(question_text) > 10:
                    questions[q_num] = {
                        'question': question_text,
                        'options': options
                    }
    
    return questions


def process_year(year):
    print(f"\nProcessing {year}...")
    
    exam_pdf = os.path.join(PAST_PAPERS_DIR, f"{year}-hsc-engineering-studies.pdf")
    mg_pdf = os.path.join(PAST_PAPERS_DIR, f"{year}-hsc-engineering-studies-mg.pdf")
    if not os.path.exists(mg_pdf):
        mg_pdf = os.path.join(PAST_PAPERS_DIR, f"{year}-hsc-engineering-studies-mg_0.pdf")
    
    exam_txt = os.path.join(EXTRACTED_TEXT_DIR, f"{year}-hsc-engineering-studies.txt")
    mg_txt = os.path.join(EXTRACTED_TEXT_DIR, f"{year}-hsc-engineering-studies-mg.txt")
    if not os.path.exists(mg_txt):
        mg_txt = os.path.join(EXTRACTED_TEXT_DIR, f"{year}-hsc-engineering-studies-mg_0.txt")
    
    if os.path.exists(exam_txt):
        with open(exam_txt, 'r', encoding='utf-8') as f:
            exam_text = f.read()
    else:
        exam_text = extract_text_from_pdf(exam_pdf)
        save_extracted_text(exam_text, exam_txt)
    
    if os.path.exists(mg_txt):
        with open(mg_txt, 'r', encoding='utf-8') as f:
            mg_text = f.read()
    else:
        mg_text = extract_text_from_pdf(mg_pdf)
        save_extracted_text(mg_text, mg_txt)
    
    questions = extract_questions_from_exam(exam_text)
    answers = extract_answers_from_marking_guide(mg_text)
    
    print(f"  Found {len(questions)} questions, {len(answers)} answers")
    
    result = []
    for q_num in sorted(questions.keys()):
        if q_num in answers:
            question_data = questions[q_num]
            answer_letter = answers[q_num]
            answer_index = ord(answer_letter) - ord('A')
            
            options = [
                question_data['options'].get('A', ''),
                question_data['options'].get('B', ''),
                question_data['options'].get('C', ''),
                question_data['options'].get('D', '')
            ]
            
            result.append({
                'id': f'past-{year}-q{q_num}',
                'year': year,
                'questionNumber': q_num,
                'question': question_data['question'],
                'options': options,
                'correctAnswer': answer_index
            })
    
    return result


def main():
    print("HSC Engineering Studies Past Papers Extractor")
    print("=" * 60)
    
    os.makedirs(EXTRACTED_TEXT_DIR, exist_ok=True)
    all_questions = []
    
    for year in YEARS:
        try:
            year_questions = process_year(year)
            all_questions.extend(year_questions)
        except Exception as e:
            print(f"  ERROR: {e}")
            import traceback
            traceback.print_exc()
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 60)
    print("Script created and questions extracted successfully")
    print(f"Total: {len(all_questions)} questions")
    
    for year in YEARS:
        count = len([q for q in all_questions if q['year'] == year])
        print(f"  {year}: {count} questions")


if __name__ == "__main__":
    main()
