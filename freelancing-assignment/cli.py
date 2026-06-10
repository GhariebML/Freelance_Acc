import os
import argparse
import sys

try:
    from rich.console import Console
    from rich.markdown import Markdown
    from rich.panel import Panel
    from rich.table import Table
except ImportError:
    print("Error: The 'rich' library is not installed.")
    print("Please run: pip install rich")
    sys.exit(1)

import sys
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

console = Console()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

FILES = {
    "brand": os.path.join(BASE_DIR, "branding", "brand_package.md"),
    "profiles": os.path.join(BASE_DIR, "platforms", "profiles.md"),
    "khamsat": os.path.join(BASE_DIR, "khamsat", "khamsat_services.md"),
    "portfolio": os.path.join(BASE_DIR, "portfolio", "portfolio_system.md"),
    "screenshots": os.path.join(BASE_DIR, "screenshots", "screenshot_guide.md"),
    "report": os.path.join(BASE_DIR, "report", "final_pdf_report.md"),
    "roadmap": os.path.join(BASE_DIR, "submission", "execution_roadmap.md"),
}

def view_section(section):
    if section not in FILES:
        console.print(f"[bold red]Error:[/] Section '{section}' not found. Available sections: {', '.join(FILES.keys())}")
        return
    
    file_path = FILES[section]
    if not os.path.exists(file_path):
        console.print(f"[bold red]Error:[/] File {file_path} does not exist. Make sure you are running the CLI from the correct directory.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    markdown = Markdown(content)
    console.print(Panel(markdown, title=f"Freelancing Assignment - {section.upper()}", border_style="cyan", padding=(1, 2)))

def status():
    table = Table(title="Assignment Execution Status", show_header=True, header_style="bold magenta")
    table.add_column("Phase", style="cyan", no_wrap=True)
    table.add_column("Task", style="white")
    table.add_column("Status", justify="center", style="bold green")

    table.add_row("1. Accounts", "Create Khamsat, Mostaql, Upwork, Freelancer, PPH", "[ ]")
    table.add_row("2. Profiles", "Copy/Paste Bios and Skills from CLI", "[ ]")
    table.add_row("3. Service", "Publish Power BI Service on Khamsat", "[ ]")
    table.add_row("4. Portfolio", "Upload 3 Projects & Screenshots", "[ ]")
    table.add_row("5. Screenshots", "Capture all profile/portfolio evidence", "[ ]")
    table.add_row("6. Final PDF", "Assemble PDF Report for Submission", "[ ]")

    console.print(table)
    console.print("\n[italic yellow]Tip: Use 'python cli.py view [section]' to get the text you need to copy-paste![/]")

def list_sections():
    console.print("\n[bold cyan]Available Sections to View:[/]")
    for key in FILES.keys():
        console.print(f"  - [green]{key}[/]")
    console.print("\nUsage: [bold white]python cli.py view <section>[/]\n")

def main():
    parser = argparse.ArgumentParser(description="Professional CLI Manager for Freelancing Assignment")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # View command
    view_parser = subparsers.add_parser("view", help="View a specific markdown deliverable with beautiful formatting")
    view_parser.add_argument("section", nargs="?", choices=list(FILES.keys()), help="The section to view")

    # Status command
    subparsers.add_parser("status", help="View the execution checklist status")

    args = parser.parse_args()

    if args.command == "view":
        if args.section:
            view_section(args.section)
        else:
            list_sections()
    elif args.command == "status":
        status()
    else:
        console.print(Panel.fit("[bold cyan]Freelancing Assignment CLI[/]\n\nManage and view your deliverables directly from the terminal.", border_style="blue"))
        console.print("[bold]Usage Examples:[/]")
        console.print("  python cli.py view brand")
        console.print("  python cli.py view profiles")
        console.print("  python cli.py status\n")
        parser.print_help()

if __name__ == "__main__":
    main()
