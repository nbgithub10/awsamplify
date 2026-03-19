# Review Skill

This skill audits all JavaScript data files in the project to verify that referenced image paths are correct and the corresponding image files actually exist on disk.

## Purpose

Before deploying or using the exam paper data, it is important to verify:
1. All image paths in the JS files point to existing files
2. Both `image` and `answerImage` paths are valid
3. Path formats are consistent across the codebase

This helps identify broken image links, missing files, and path inconsistencies before they cause issues in the application.

## Prerequisites

- The project has a `public/past-papers-images/` directory containing all images
- The project has a `src/data/` directory containing JavaScript data files
- The review script uses relative paths from the project root

## Execution Steps

When executing this skill, perform the following:

### Step 1: Identify All Data Directories

The `src/data/` directory contains multiple subdirectories:
- `past_papers/` - Contains exam papers organized by subject
  - `earth-and-environmental-science/`
  - `engineering-studies/`
  - `maths-advanced/`
  - `maths-extension/`
- `engg_papers/` - Engineering papers
- `studocu/` - Study documents

### Step 2: Extract Image References

For each JavaScript file, extract all unique image paths from:
- `image` fields
- `answerImage` fields

Example regex pattern:
```bash
grep -oE '"/past-papers-images/[^"]+\.png"' "$file" | sed 's/"//g'
```

### Step 3: Verify File Existence

For each extracted path:
1. Remove the leading `/` to get relative path
2. Prepend `public/` to get absolute file system path
3. Check if file exists using `[ -f "$path" ]`

### Step 4: Generate Report

Create a report with the following sections:

**Summary:**
- Total files checked
- Total images referenced
- OK links (exist)
- Missing links (404s)

**Missing Links (Grouped by File):**
```
src/data/past_papers/maths-advanced/2020-maths-advanced.js
  ✗ /past-papers-images/2020-maths-advanced/2020-maths-advanced_Page_2.png
  ✗ /past-papers-images/2020-maths-advanced/2020-maths-advanced-mg_Page_1.png
```

**OK Links (Brief):**
```
src/data/past_papers/earth-and-environmental-science/2023-hsc-earth-and-environmental-science.js
  ✓ 45/45 images found
```

### Step 5: Fix Common Issues

Common path issues to look for and potentially fix:
- Underscores vs hyphens in folder/file names
- `_Page_` vs `-Page-` in image filenames
- Missing leading `/` in paths
- Incorrect folder structure (e.g., pointing to wrong subject folder)

## Output Format

The report should be saved to a timestamped file and displayed in console:

```
==========================================
IMAGE PATH REVIEW REPORT
==========================================
Generated: [TIMESTAMP]
==========================================

SUMMARY:
- Files checked: X
- Total images referenced: X
- OK links: X
- Missing links: X

------------------------------------------
MISSING LINKS (Action Required):
------------------------------------------
[FILE_NAME]
  ✗ [MISSING_PATH]

------------------------------------------
OK LINKS:
------------------------------------------
[FILE_NAME]
  ✓ X/X images found

==========================================
END OF REPORT
==========================================
```

## Notes

- Image paths in JS files use format: `/past-papers-images/[SUBJECT]/[FILENAME].png`
- The actual files are located at: `public/past-papers-images/[SUBJECT]/[FILENAME].png`
- The script should handle both absolute paths (starting with `/`) and relative paths
- Group results by subject/file for easy identification of problem areas
