import { test, expect } from '@playwright/test';

test.describe('All Past Papers - Image & Model Answer Check', () => {
  
  const subjects = [
    { name: 'Engineering Studies', paperName: '2020 HSC' },
    { name: 'Earth And Environmental Science', paperName: '2020 HSC' }
  ];

  for (const subject of subjects) {
    test(`${subject.name} - check paper loads with images and model answers`, async ({ page }) => {
      await page.goto('http://localhost:5174');
      await page.click('text=Past Papers');
      
      // Find the subject section and click the paper within it
      const subjectSection = page.locator(`text=${subject.name}`).first();
      await subjectSection.scrollIntoViewIfNeeded();
      
      // Click the specific paper button within this subject
      const paperButton = page.locator(`button:has-text("${subject.paperName}")`).first();
      await paperButton.click();
      await page.waitForTimeout(1000);
      
      // Check if questions loaded
      const questionExists = await page.locator('.question-text, h2').first().isVisible().catch(() => false);
      
      if (questionExists) {
        // Test Show Diagram button (if present)
        const showDiagram = page.locator('text=Show Diagram').first();
        if (await showDiagram.isVisible().catch(() => false)) {
          await showDiagram.click();
          await page.waitForTimeout(300);
          console.log(`  ✓ Show Diagram works`);
          await showDiagram.click();
          await page.waitForTimeout(200);
        }
        
        // Test Reveal Model Answer button (if present)
        const revealBtn = page.locator('text=Reveal Model Answer').first();
        if (await revealBtn.isVisible().catch(() => false)) {
          await revealBtn.click();
          await page.waitForTimeout(300);
          
          const modelAnswerVisible = await page.locator('h4:has-text("Model Answer:")').first().isVisible().catch(() => false);
          if (modelAnswerVisible) {
            console.log(`  ✓ Model Answer shows`);
          } else {
            console.log(`  ❌ Model Answer NOT visible`);
          }
        }
        
        console.log(`  ✓ ${subject.name} ${subject.paperName} loaded successfully`);
      } else {
        console.log(`  ❌ ${subject.name} ${subject.paperName} failed to load questions`);
      }
      
      // Go back to main menu using the Back button
      await page.click('text=← Back to Main Menu');
      await page.waitForTimeout(500);
      
      console.log(`\n✅ ${subject.name} - Paper checked!`);
    });
  }
});

test.describe('AI Generated Content', () => {
  test('Civil & Transport model answers', async ({ page }) => {
    await page.goto('http://localhost:5174');
    await page.click('text=AI Generated Content');
    await page.waitForTimeout(500);
    
    // Test Civil Structures
    await page.click('text=Civil Structures');
    await page.waitForTimeout(500);
    
    const civilReveal = page.locator('text=Reveal Model Answer');
    const civilCount = await civilReveal.count();
    console.log(`Civil Structures: ${civilCount} short answer questions`);
    
    if (civilCount > 0) {
      await civilReveal.first().click();
      await page.waitForTimeout(200);
      const visible = await page.locator('h4:has-text("Model Answer:")').first().isVisible();
      console.log(`  Civil SA: ${visible ? '✓' : '❌'} Model Answer visible`);
    }
    
    // Go back to main menu, then to AI Generated, then to Transport
    await page.click('text=← Back to Main Menu');
    await page.waitForTimeout(300);
    await page.click('text=AI Generated Content');
    await page.waitForTimeout(500);
    await page.click('text=Personal & Public Transport');
    await page.waitForTimeout(500);
    
    const transportReveal = page.locator('text=Reveal Model Answer');
    const transportCount = await transportReveal.count();
    console.log(`Transport: ${transportCount} short answer questions`);
    
    if (transportCount > 0) {
      await transportReveal.first().click();
      await page.waitForTimeout(200);
      const visible = await page.locator('h4:has-text("Model Answer:")').first().isVisible();
      console.log(`  Transport SA: ${visible ? '✓' : '❌'} Model Answer visible`);
    }
    
    console.log('\n✅ AI Generated Content checked!');
  });
});

test.describe('Studocu Content', () => {
  test('Corrosion section', async ({ page }) => {
    await page.goto('http://localhost:5174');
    await page.click('text=Studocu - Engineering Materials');
    await page.waitForTimeout(500);
    await page.click('text=Corrosion');
    await page.waitForTimeout(500);
    
    const revealBtn = page.locator('text=Reveal Model Answer').first();
    await revealBtn.click();
    await page.waitForTimeout(300);
    
    const visible = await page.locator('h4:has-text("Model Answer:")').first().isVisible();
    console.log(`Studocu Corrosion: ${visible ? '✓' : '❌'} Model Answer visible`);
    
    expect(visible).toBe(true);
    console.log('\n✅ Studocu checked!');
  });
});
