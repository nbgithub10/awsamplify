const fs = require('fs');
const path = require('path');

// Basic command line argument checking
if (process.argv.length < 4) {
    console.error("Usage: node convert-json-to-multiple-choice.js <input.json> <output.json>");
    process.exit(1);
}

const inputPath = path.resolve(process.argv[2]);
const outputPath = path.resolve(process.argv[3]);

// Ensure the output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generate a prefix for IDs based on filename
const filePrefix = path.basename(inputPath, '.json').replace(/[^a-zA-Z0-9]/g, '');

try {
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const questionsArray = JSON.parse(rawData);
    
    const transformedQuestions = {
        title: path.basename(inputPath, '.json'),
        multipleChoice: [],
        shortAnswer: []
    };

    questionsArray.forEach((q) => {
        const fullText = q.questionText || "";
        
        // Regex to find "A. " or "A) " at the start of a line
        // We use [\s\S]*? to capture everything until the next option or end of string
        const optionsRegex = /(?:^|\n)\s*([A-D])[\.\)]\s*([\s\S]*?)(?=(?:\n\s*[A-D][\.\)]|$))/gi;
        
        let match;
        let optionsMap = {};
        let optionsStartIndex = -1;

        // Iterate through all matches to extract options
        while ((match = optionsRegex.exec(fullText)) !== null) {
            if (optionsStartIndex === -1) {
                // The first time we find an option, mark the end of the actual question text
                optionsStartIndex = match.index;
            }
            const letter = match[1].toUpperCase();
            const optionText = match[2].trim();
            optionsMap[letter] = optionText;
        }

        // Check if we found all 4 standard multiple choice options
        const hasOptions = optionsMap['A'] && optionsMap['B'] && optionsMap['C'] && optionsMap['D'];

        if (hasOptions) {
            // It's a multiple choice question
            const mainQuestionText = fullText.substring(0, optionsStartIndex).trim();
            const optionsArray = [optionsMap['A'], optionsMap['B'], optionsMap['C'], optionsMap['D']];
            
            // Map the answer text ('A', 'B', etc.) to index (0, 1, etc.)
            let correctIndex = -1;
            const answerStr = (q.answerText || "").trim().toUpperCase();
            if (answerStr === 'A') correctIndex = 0;
            else if (answerStr === 'B') correctIndex = 1;
            else if (answerStr === 'C') correctIndex = 2;
            else if (answerStr === 'D') correctIndex = 3;

            transformedQuestions.multipleChoice.push({
                id: `${filePrefix}-q${q.questionNo}`,
                question: mainQuestionText,
                options: optionsArray,
                correctAnswer: correctIndex,
                image: q.questionImage || null,
                // Passing answer image just in case it's needed for feedback later
                answerImage: q.answerImage || null,
                pageNo: q.PageNo // keeping page reference
            });
        } else {
            // It's likely a short answer or complex question
            transformedQuestions.shortAnswer.push({
                id: `${filePrefix}-q${q.questionNo}`,
                question: fullText.trim(),
                answer: (q.answerText || "").trim(),
                image: q.questionImage || null,
                answerImage: q.answerImage || null,
                pageNo: q.PageNo
            });
        }
    });

    fs.writeFileSync(outputPath, JSON.stringify(transformedQuestions, null, 2));
    console.log(`Successfully converted ${inputPath} -> ${outputPath}`);

} catch (err) {
    console.error(`Error processing JSON file: ${err.message}`);
    process.exit(1);
}
