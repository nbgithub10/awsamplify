import fitz  # PyMuPDF
import os

def capture_pages_as_images(pdf_path, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    doc = fitz.open(pdf_path)
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]

    print(f"--- Rendering: {pdf_path} ---")

    for page_index in range(len(doc)):
        page = doc[page_index]

        # Increase resolution for crisp math symbols (300 DPI)
        # zoom = 2 means 200%, zoom = 4 means 400%
        zoom = 3
        mat = fitz.Matrix(zoom, zoom)

        # This renders the WHOLE page (text + vector diagrams + images)
        pix = page.get_pixmap(matrix=mat, alpha=False)

        image_filename = f"{base_name}_Page_{page_index + 1}.png"
        image_path = os.path.join(output_folder, image_filename)

        pix.save(image_path)
        pix = None

    print(f"Done rendering {len(doc)} pages.")
    doc.close()

# --- RUN SCRIPT ---
pdf_files = [f for f in os.listdir('.') if f.lower().endswith('.pdf')]
output_dir = "rendered_math_pages"

if not pdf_files:
    print("No PDFs found!")
else:
    for pdf in pdf_files:
        capture_pages_as_images(pdf, output_dir)
    print(f"\nSuccess! Full page images are in '{output_dir}'.")