import os
import markdown

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REPORT_MD = os.path.join(BASE_DIR, "report", "final_pdf_report.md")
OUTPUT_HTML = os.path.join(BASE_DIR, "Final_Submission_Mohamed_Gharieb.html")

# Professional CSS Styling for the Report
CSS = """
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
    body {
        font-family: 'Inter', sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 850px;
        margin: 0 auto;
        padding: 40px;
        background-color: #f9fafb;
    }
    .report-container {
        background-color: #ffffff;
        padding: 50px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    h1 {
        color: #1a56db;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 10px;
        text-align: center;
        font-size: 2.2em;
    }
    h2 {
        color: #1f2937;
        margin-top: 30px;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 5px;
    }
    h3 {
        color: #374151;
    }
    ul {
        margin-bottom: 20px;
    }
    li {
        margin-bottom: 8px;
    }
    .placeholder {
        background-color: #fef3c7;
        color: #92400e;
        padding: 10px;
        border-left: 4px solid #f59e0b;
        font-weight: bold;
        margin: 15px 0;
        display: block;
        text-align: center;
    }
    @media print {
        body { background-color: #ffffff; padding: 0; }
        .report-container { box-shadow: none; padding: 0; }
        .page-break { page-break-before: always; }
    }
</style>
"""

def generate_html():
    if not os.path.exists(REPORT_MD):
        print(f"Error: Could not find {REPORT_MD}")
        return

    with open(REPORT_MD, "r", encoding="utf-8") as f:
        md_text = f.read()

    # Replace placeholder text with styled HTML div
    md_text = md_text.replace("[INSERT", "<div class='placeholder'>[INSERT")
    md_text = md_text.replace("HERE]", "HERE]</div>")

    # Convert Markdown to HTML
    html_content = markdown.markdown(md_text, extensions=['tables'])

    # Assemble final HTML
    final_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Freelancing Platforms Assignment - Mohamed Gharieb</title>
        {CSS}
    </head>
    <body>
        <div class="report-container">
            {html_content}
        </div>
    </body>
    </html>
    """

    with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
        f.write(final_html)

    print(f"Success! Professional HTML report generated at: {OUTPUT_HTML}")
    print("To create your final PDF: Open the HTML file in Chrome/Edge, press Ctrl+P, and select 'Save as PDF'.")

if __name__ == "__main__":
    generate_html()
