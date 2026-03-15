#!/bin/bash

# Ensure all necessary directories exist
mkdir -p ./unprocessed ./processing ./processed ./json-output

echo "Starting PDF processing loop..."

# Keep looping as long as there are files in unprocessed
while true; do
    # Find the first -mg.pdf file in unprocessed
    mg_file=$(find ./unprocessed -maxdepth 1 -name "*-mg.pdf" | head -n 1)
    
    # If no files found, break the loop
    if [ -z "$mg_file" ]; then
        echo "No more files to process in ./unprocessed. Exiting."
        break
    fi
    
    # Extract the base filename (e.g., "file1" from "./unprocessed/file1-mg.pdf")
    basename=$(basename "$mg_file" -mg.pdf)
    base_pdf="./unprocessed/${basename}.pdf"
    
    # Check if the paired standard PDF exists
    if [ ! -f "$base_pdf" ]; then
        echo "Warning: Found $mg_file but missing paired $base_pdf. Skipping and moving to processed to avoid infinite loop."
        mv "$mg_file" ./processed/
        continue
    fi
    
    echo "Processing pair: ${basename}.pdf and ${basename}-mg.pdf"
    
    # 1. Move files to processing directory
    mv "$base_pdf" "./processing/"
    mv "$mg_file" "./processing/"
    
    # 2. Extract Images
    cd ./processing
    echo "Extracting images..."
    python3 ../extract_images.py "${basename}.pdf" "${basename}-mg.pdf"
    
    # 3. Create multiple zip files (≤20 files each, flat structure)

    # Collect all files into an array (with full path for images)
    all_files=("${basename}.pdf" "${basename}-mg.pdf")
    while IFS= read -r img; do
        all_files+=("rendered_math_pages/$img")
    done < <(ls rendered_math_pages/)

    # Calculate number of parts needed
    total_files=${#all_files[@]}
    num_parts=$(( (total_files + 19) / 20 ))
    echo "Creating $num_parts zip file(s) from $total_files files..."

    # Create zip parts - each with up to 20 files, flat structure (zip -j)
    part_num=1
    file_count=0
    current_zip=""

    for file in "${all_files[@]}"; do
        if [ $((file_count % 20)) -eq 0 ] && [ $file_count -gt 0 ]; then
            ((part_num++))
        fi
        
        if [ $((file_count % 20)) -eq 0 ]; then
            current_zip="${basename}_part${part_num}.zip"
            rm -f "$current_zip"
        fi
        
        zip -j "$current_zip" "$file"
        ((file_count++))
    done

    # Step OUT of processing directory
    cd ..

    # Move all zip parts to processed
    for zip in ./processing/${basename}_part*.zip; do
        [ -f "$zip" ] && mv "$zip" ./processed/
    done

    # 4. Pass to opencode for JSON extraction
    echo "=========================================="
    echo "[OPENCODE] Starting JSON extraction..."
    echo "[OPENCODE] Model: google/gemini-2.0-flash"
    echo "[OPENCODE] Input zips: ./processed/${basename}_part*.zip"
    echo "[OPENCODE] Output file: ./json-output/${basename}.js"
    echo "[OPENCODE] Timestamp: $(date)"
    echo "=========================================="
    
    prompt="I have provided the PDFs and high-resolution images of every page in the zip files ./processed/${basename}_part*.zip. Please unzip them and extract all questions and their corresponding answers. Output the result as a JavaScript file that exports a 'paperData' object. Follow this EXACT format:

export const paperData = {
  \"title\": \"[basename]\",
  \"multipleChoice\": [
    {
      \"id\": \"[slug]-q[number]\",
      \"question\": \"[question text]\",
      \"options\": [\"option A\", \"option B\", \"option C\", \"option D\"],
      \"correctAnswer\": [0-3],
      \"image\": \"[question_page_image]\",
      \"answerImage\": \"[answer_page_image]\",
      \"pageNo\": \"[page number]\"
    }
  ],
  \"shortAnswer\": [
    {
      \"id\": \"[slug]-q[number]\",
      \"question\": \"[question text]\",
      \"answer\": \"[answer text]\",
      \"image\": \"[question_page_image]\",
      \"answerImage\": \"[answer_page_image]\",
      \"pageNo\": \"[page number]\"
    }
  ]
}

IMPORTANT - Question Numbering Format:
- The question ID should EXACTLY match how the question appears in the PDF image
- Use this format WITH parentheses exactly as shown:
  - Q22(a) in image → use \"q22(a)\"
  - Q21(a-i) in image → use \"q21(a-i)\" 
  - Q21(a-ii) in image → use \"q21(a-ii)\" (use ii for second sub-part)
  - Q26(a), Q26(b), etc. → use \"q26(a)\", \"q26(b)\"
- The ID MUST match exactly - including parentheses and hyphens where they appear in the PDF
- For image paths, just use the filename like \"[basename]_Page_22.png\" (no folder paths)

For multiple choice questions (typically Q1-Q20), extract the 4 options and determine the correct answer index (0=A, 1=B, 2=C, 3=D). For short answer questions (Q21+), extract the full question and answer text. Use the images to ensure mathematical diagrams are referenced accurately. Save the output as a .js file in ./json-output/ named ${basename}.js."
    
    echo "[OPENCODE] Invoking model with prompt..."
    opencode run --model google/gemini-3-flash-preview --print-logs --log-level INFO "$prompt"
    opencode_exit_code=$?
    
    echo "=========================================="
    echo "[OPENCODE] JSON extraction completed"
    echo "[OPENCODE] Exit code: $opencode_exit_code"
    echo "[OPENCODE] Checking output file..."
    if [ -f "./json-output/${basename}.js" ]; then
        echo "[OPENCODE] Output file exists: ./json-output/${basename}.js"
        echo "[OPENCODE] File size: $(ls -lh "./json-output/${basename}.js" | awk '{print $5}')"
    else
        echo "[OPENCODE] ERROR: Output file NOT found: ./json-output/${basename}.js"
    fi
    echo "[OPENCODE] Timestamp: $(date)"
    echo "=========================================="

    # 5. Organize output into self-contained folder
    echo "=========================================="
    echo "[ORGANIZE] Creating self-contained folder for ${basename}..."
    
    # Create folder: ./json-output/${basename}/
    mkdir -p "./json-output/${basename}"
    
    # Copy the JS file
    cp "./json-output/${basename}.js" "./json-output/${basename}/"
    
    # Copy all rendered images from processing/rendered_math_pages/
    if [ -d "./processing/rendered_math_pages" ]; then
        cp ./processing/rendered_math_pages/*.png "./json-output/${basename}/" 2>/dev/null
    fi
    
    # Fix image paths in the JS file (update from "../rendered_math_pages/..." to "./")
    sed -i '' "s|../rendered_math_pages/${basename}/|./|g" "./json-output/${basename}/${basename}.js"
    
    # Clean up - keep PDFs, remove rendered images from processing
    rm -rf "./processing/rendered_math_pages"
    rm -f "./json-output/${basename}.js"  # Remove the flat JS file
    
    echo "[ORGANIZE] Self-contained folder created: ./json-output/${basename}/"
    echo "[ORGANIZE] Timestamp: $(date)"
    echo "=========================================="

    # 5. Inject into React App
    echo "=========================================="
    echo "[OPENCODE] Starting React app integration..."
    echo "[OPENCODE] Input file: ./json-output/${basename}.js"
    echo "[OPENCODE] Model: google/gemini-2.0-flash"
    echo "[OPENCODE] Timestamp: $(date)"
    echo "=========================================="

    # Delete PDFs and rendered images from processing
#    rm -f "./processing/${basename}.pdf"
#    rm -f "./processing/${basename}-mg.pdf"
    rm -rf "./processing/rendered_math_pages"
    
    echo "Finished processing $basename"
    echo "-----------------------------------"
done
