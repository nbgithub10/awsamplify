#!/usr/bin/env python3
"""
Better PDF extraction using PyMuPDF - preserves layout and can extract images
"""
import fitz  # PyMuPDF
import json
import os
import re

def extract_text_with_layout(pdf_path):
    """Extract text from PDF preserving layout using PyMuPDF"""
    doc = fitz.open(pdf_path)
    all_text = []
    
    for page_num, page in enumerate(doc, 1):
        # Get text with layout preserved
        text = page.get_text("text")
        all_text.append({
            'page': page_num,
            'text': text
        })
    
    doc.close()
    return all_text

def extract_images(pdf_path, output_dir):
    """Extract images from PDF pages"""
    os.makedirs(output_dir, exist_ok=True)
    doc = fitz.open(pdf_path)
    image_info = []
    
    for page_num, page in enumerate(doc, 1):
        # Get images on this page
        image_list = page.get_images()
        
        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            # Save image
            image_filename = f"page{page_num}_img{img_index}.{image_ext}"
            image_path = os.path.join(output_dir, image_filename)
            
            with open(image_path, "wb") as img_file:
                img_file.write(image_bytes)
            
            image_info.append({
                'page': page_num,
                'filename': image_filename,
                'path': image_path
            })
    
    doc.close()
    return image_info

def parse_mc_questions_improved(pages_text, year):
    """Improved parsing for multiple choice questions"""
    questions = []
    
    # Combine all text
    full_text = "\n".join([p['text'] for p in pages_text])
    
    # Split into sections by page or question number patterns
    lines = full_text.split('\n')
    
    current_q = None
    question_text = ""
    options = []
    in_section_i = False
    question_num = 0
    
    for i, line in enumerate(lines):
        line = line.strip()
        
        # Detect Section I (multiple choice section)
        if 'Section I' in line or 'SECTION I' in line:
            in_section_i = True
            continue
        
        # Stop at Section II
        if 'Section II' in line or 'SECTION II' in line:
            break
        
        if not in_section_i:
            continue
        
        # Check if line is a question number (standalone number 1-20)
        if re.match(r'^(\d{1,2})$', line):
            num = int(line)
            if 1 <= num <= 20:
                # Save previous question
                if current_q is not None and len(options) == 4:
                    questions.append({
                        'number': current_q,
                        'question': question_text.strip(),
                        'options': options,
                        'year': year
                    })
                
                # Start new question
                current_q = num
                question_num = num
                question_text = ""
                options = []
                continue
        
        # Check if line starts with A. B. C. or D. (option)
        option_match = re.match(r'^([A-D])[.\)]\s*(.+)$', line)
        if option_match and current_q is not None:
            option_letter = option_match.group(1)
            option_text = option_match.group(2).strip()
            
            # Only add if we haven't collected 4 options yet
            if len(options) < 4:
                options.append(option_text)
            continue
        
        # Otherwise, add to question text if we're in a question
        if current_q is not None and len(options) == 0:
            # Skip common non-question lines
            if line and not any(skip in line.lower() for skip in 
                ['page', '–', 'marks', 'allow about', 'attempt questions']):
                question_text += " " + line
    
    # Don't forget last question
    if current_q is not None and len(options) == 4:
        questions.append({
            'number': current_q,
            'question': question_text.strip(),
            'options': options,
            'year': year
        })
    
    return questions

def extract_answers_from_mg(pdf_path, year):
    """Extract answers from marking guidelines"""
    doc = fitz.open(pdf_path)
    answers = {}
    
    for page in doc:
        text = page.get_text("text")
        lines = text.split('\n')
        
        for line in lines:
            # Look for "Question Answer" section
            # Format: "1    C" or "Question 1: C"
            match = re.search(r'^\s*(\d{1,2})\s+([A-D])\s*$', line.strip())
            if match:
                q_num = int(match.group(1))
                answer = match.group(2).upper()
                if 1 <= q_num <= 20:
                    answers[q_num] = answer
    
    doc.close()
    return answers

def main():
    years = [2020, 2021, 2022, 2024, 2025]
    all_questions = []
    
    for year in years:
        print(f"\n{'='*60}")
        print(f"Processing {year}...")
        print(f"{'='*60}")
        
        exam_file = f"past-papers/{year}-hsc-engineering-studies.pdf"
        mg_file = f"past-papers/{year}-hsc-engineering-studies-mg.pdf"
        if year == 2025:
            mg_file = f"past-papers/{year}-hsc-engineering-studies-mg_0.pdf"
        
        if not os.path.exists(exam_file):
            print(f"  ❌ Exam file not found")
            continue
        
        # Extract text
        pages = extract_text_with_layout(exam_file)
        print(f"  ✓ Extracted {len(pages)} pages")
        
        # Extract images
        image_dir = f"extracted-images/{year}"
        images = extract_images(exam_file, image_dir)
        print(f"  ✓ Extracted {len(images)} images to {image_dir}/")
        
        # Parse questions
        questions = parse_mc_questions_improved(pages, year)
        print(f"  ✓ Found {len(questions)} questions")
        
        # Extract answers
        if os.path.exists(mg_file):
            answers = extract_answers_from_mg(mg_file, year)
            print(f"  ✓ Found {len(answers)} answers")
            
            # Match answers to questions
            for q in questions:
                if q['number'] in answers:
                    answer_letter = answers[q['number']]
                    q['correctAnswer'] = ord(answer_letter) - ord('A')
                    q['correctAnswerLetter'] = answer_letter
            
            matched = len([q for q in questions if 'correctAnswer' in q])
            print(f"  ✓ Matched {matched}/{len(questions)} answers")
        
        all_questions.extend(questions)
    
    # Save results
    output_file = "extracted_questions_improved.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*60}")
    print(f"FINAL SUMMARY")
    print(f"{'='*60}")
    print(f"Total questions extracted: {len(all_questions)}")
    print(f"Questions with answers: {len([q for q in all_questions if 'correctAnswer' in q])}")
    print(f"Saved to: {output_file}")
    
    # Show breakdown
    print(f"\nBreakdown by year:")
    for year in years:
        year_qs = [q for q in all_questions if q['year'] == year]
        print(f"  {year}: {len(year_qs)}/20")
    
    # Show sample
    if all_questions:
        print(f"\nSample question:")
        sample = all_questions[0]
        print(f"  Year: {sample['year']}")
        print(f"  Q{sample['number']}: {sample['question'][:80]}...")
        print(f"  Options: {sample['options']}")
        if 'correctAnswer' in sample:
            print(f"  Answer: {sample.get('correctAnswerLetter', '?')} (index {sample['correctAnswer']})")

if __name__ == "__main__":
    main()
