import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const profile = await db.userProfile.findUnique({
      where: { id: 'default-profile' },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'No profile found. Please create a profile first.' },
        { status: 400 }
      )
    }

    const nutritionPlan = await db.nutritionPlan.findFirst({
      where: { profileId: profile.id },
    })

    const workoutPlan = await db.workoutPlan.findFirst({
      where: { profileId: profile.id },
    })

    const progressEntries = await db.progressEntry.findMany({
      where: { profileId: profile.id },
      orderBy: { date: 'desc' },
      take: 10,
    })

    // Create HTML content for PDF
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background: #1a1a1a;
      color: #e0e0e0;
      line-height: 1.6;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    h1 {
      font-size: 32px;
      margin-bottom: 10px;
      color: #ffffff;
      border-bottom: 3px solid #333;
      padding-bottom: 10px;
    }
    h2 {
      font-size: 24px;
      margin-top: 30px;
      margin-bottom: 15px;
      color: #cccccc;
      border-left: 4px solid #555;
      padding-left: 15px;
    }
    h3 {
      font-size: 18px;
      margin-top: 20px;
      margin-bottom: 10px;
      color: #aaaaaa;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin: 20px 0;
    }
    .metric-card {
      background: #252525;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #333;
    }
    .metric-value {
      font-size: 28px;
      font-weight: bold;
      color: #ffffff;
    }
    .metric-label {
      font-size: 12px;
      color: #888888;
      text-transform: uppercase;
      margin-top: 5px;
    }
    .macros {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin: 20px 0;
    }
    .macro-item {
      background: #252525;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #333;
      text-align: center;
    }
    .macro-value {
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
    }
    .macro-name {
      font-size: 14px;
      color: #aaaaaa;
      margin-top: 5px;
    }
    .macro-percent {
      font-size: 12px;
      color: #666666;
      margin-top: 3px;
    }
    .section {
      background: #1f1f1f;
      padding: 25px;
      border-radius: 10px;
      margin: 20px 0;
      border: 1px solid #333;
    }
    .meal, .workout-day {
      background: #2a2a2a;
      padding: 15px;
      border-radius: 6px;
      margin: 10px 0;
      border-left: 3px solid #444;
    }
    .meal-title, .day-title {
      font-weight: bold;
      font-size: 16px;
      color: #ffffff;
      margin-bottom: 10px;
    }
    .food-item, .exercise {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #333;
      font-size: 13px;
    }
    .food-item:last-child, .exercise:last-child {
      border-bottom: none;
    }
    .food-name { color: #cccccc; }
    .food-macros { color: #888888; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #333;
      text-align: center;
      font-size: 12px;
      color: #666666;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #333;
      font-size: 13px;
    }
    th {
      color: #aaaaaa;
      font-weight: bold;
    }
    td { color: #cccccc; }
  </style>
</head>
<body>
  <div class="container">
    <h1>MN Smart Nutrition Plan</h1>
    <p style="color: #888888; margin-bottom: 30px;">Generated on ${new Date().toLocaleDateString()}</p>

    ${nutritionPlan ? `
    <h2>Nutrition Overview</h2>
    <div class="metrics">
      <div class="metric-card">
        <div class="metric-value">${Math.round(nutritionPlan.bmr)}</div>
        <div class="metric-label">BMR (kcal)</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${Math.round(nutritionPlan.tdee)}</div>
        <div class="metric-label">TDEE (kcal)</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${Math.round(nutritionPlan.targetCalories)}</div>
        <div class="metric-label">Target (kcal)</div>
      </div>
    </div>

    <div class="macros">
      <div class="macro-item">
        <div class="macro-value">${Math.round(nutritionPlan.proteinGrams)}g</div>
        <div class="macro-name">Protein</div>
        <div class="macro-percent">${Math.round(nutritionPlan.proteinPercent)}%</div>
      </div>
      <div class="macro-item">
        <div class="macro-value">${Math.round(nutritionPlan.carbsGrams)}g</div>
        <div class="macro-name">Carbohydrates</div>
        <div class="macro-percent">${Math.round(nutritionPlan.carbsPercent)}%</div>
      </div>
      <div class="macro-item">
        <div class="macro-value">${Math.round(nutritionPlan.fatsGrams)}g</div>
        <div class="macro-name">Fats</div>
        <div class="macro-percent">${Math.round(nutritionPlan.fatsPercent)}%</div>
      </div>
    </div>

    <div class="section">
      <h3>Daily Target</h3>
      <p style="color: #aaaaaa; font-size: 14px;">
        ${Math.round(nutritionPlan.targetCalories)} calories daily with balanced macros for ${profile.primaryGoal.replace('_', ' ')}
      </p>
    </div>
    ` : '<p style="color: #666666;">No nutrition plan generated yet.</p>'}

    ${workoutPlan ? `
    <h2>Workout Plan</h2>
    <p style="color: #888888; margin-bottom: 15px;">${workoutPlan.weeklySplit}</p>
    <div class="section">
      ${JSON.parse(workoutPlan.workoutDays).map((day: any) => `
        <div class="workout-day">
          <div class="day-title">${day.day} - ${day.focus}</div>
          ${day.exercises.map((ex: any) => `
            <div class="exercise">
              <span>${ex.name}</span>
              <span>${ex.sets} × ${ex.reps}</span>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
    ` : '<p style="color: #666666;">No workout plan generated yet.</p>'}

    ${progressEntries && progressEntries.length > 0 ? `
    <h2>Progress History</h2>
    <div class="section">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Weight</th>
            <th>Body Fat</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${progressEntries.slice(0, 10).map((entry) => `
            <tr>
              <td>${new Date(entry.date).toLocaleDateString()}</td>
              <td>${entry.weight} kg</td>
              <td>${entry.bodyFatPercent ? entry.bodyFatPercent + '%' : '-'}</td>
              <td>${entry.notes || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    <div class="footer">
      <p>MN Smart Nutrition - Precision Nutrition & Fitness Tracking</p>
      <p style="margin-top: 5px;">Disclaimer: This information is for educational purposes only and does not constitute medical advice.</p>
    </div>
  </div>
</body>
</html>
    `

    // Return HTML as response (client will handle PDF generation)
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': 'attachment; filename="nutrition-plan.html"',
      },
    })
  } catch (error) {
    console.error('Error exporting PDF:', error)
    return NextResponse.json(
      { error: 'Failed to export PDF' },
      { status: 500 }
    )
  }
}
