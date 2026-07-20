import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    // Generate realistic Excel workbook with financial / project rows
    const sampleData = [
      { "Item ID": "SDTA-101", "Category": "Infrastructure", "Quarter": "Q1 2026", "Budget ($)": 45000, "Status": "Approved", "Lead": "Elena Rostova" },
      { "Item ID": "SDTA-102", "Category": "Cloud Databases", "Quarter": "Q1 2026", "Budget ($)": 28000, "Status": "Completed", "Lead": "Alexander Vance" },
      { "Item ID": "SDTA-103", "Category": "UI/UX System", "Quarter": "Q2 2026", "Budget ($)": 19500, "Status": "In Progress", "Lead": "Marcus Sterling" },
      { "Item ID": "SDTA-104", "Category": "Security Audit", "Quarter": "Q2 2026", "Budget ($)": 32000, "Status": "Pending", "Lead": "David Miller" },
      { "Item ID": "SDTA-105", "Category": "Data Pipeline", "Quarter": "Q3 2026", "Budget ($)": 54000, "Status": "Scheduled", "Lead": "Sophia Chen" },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SDTA Budget");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    return new Response(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="SDTA_Financial_Report.xlsx"'
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate sample Excel sheet' }, { status: 500 });
  }
}
