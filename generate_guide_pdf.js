import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function generateUserGuide() {
    console.log('Starting User Guide Generation...');
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set viewport to mobile size for better screenshots of the PWA
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });

    const baseUrl = 'http://localhost:5173';
    const screenshotsDir = path.resolve('user_guide_screenshots');

    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }

    const routes = [
        { path: '/dashboard', name: 'Dashboard', desc: 'The main command center.' },
        { path: '/fitness', name: 'Fitness Hub', desc: 'Track your workouts and health.' },
        { path: '/fitness/create-plan', name: 'AI Workout Planner', desc: 'Generate custom workout plans using AI.' },
        { path: '/projects', name: 'Project Management', desc: 'Manage your tasks and projects.' },
        { path: '/social', name: 'Social Feed', desc: 'Connect with the community.' },
        { path: '/finance', name: 'Finance Tracker', desc: 'Monitor your income and expenses.' }
    ];

    const screenshots = [];

    try {
        // Login flow (if needed, but assuming dev mode might bypass or we can bypass)
        // For now, hitting pages directly as we are in dev mode and removed strict auth checks or can inject auth

        // In App.tsx, there is a PrivateRoute. 
        // "For demo purposes, we'll allow access if no user" -> commented out checking !user.
        // So we should be able to access routes directly.

        for (const route of routes) {
            console.log(`Navigating to ${route.name}...`);
            await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'networkidle0' });

            // Wait a bit for animations
            await new Promise(r => setTimeout(r, 2000));

            const screenshotPath = path.join(screenshotsDir, `${route.name.replace(/\s+/g, '_')}.jpg`);
            await page.screenshot({ path: screenshotPath, type: 'jpeg', quality: 90 });
            screenshots.push({ ...route, path: screenshotPath });
            console.log(`Captured ${route.name}`);
        }

        // Generate HTML for PDF
        let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MyPlan User Guide</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; }
          h1 { text-align: center; color: #2563eb; margin-bottom: 40px; }
          .page-break { page-break-after: always; }
          .section { margin-bottom: 50px; text-align: center; }
          h2 { color: #1e293b; margin-bottom: 10px; }
          p { margin-bottom: 20px; color: #64748b; }
          img { border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); max-width: 300px; border: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <h1>MyPlan Application User Guide</h1>
        <p style="text-align: center; font-size: 1.2em;">Complete guide to using the MyPlan PWA features.</p>
        <div class="page-break"></div>
    `;

        for (const screen of screenshots) {
            // Read image as base64 to embed in HTML for PDF generation
            const imgData = fs.readFileSync(screen.path).toString('base64');
            const imgSrc = `data:image/jpeg;base64,${imgData}`;

            htmlContent += `
        <div class="section">
          <h2>${screen.name}</h2>
          <p>${screen.desc}</p>
          <img src="${imgSrc}" />
        </div>
        <div class="page-break"></div>
      `;
        }

        htmlContent += `</body></html>`;

        // Generate PDF
        console.log('Generating PDF...');
        await page.setContent(htmlContent);
        await page.setViewport({ width: 1200, height: 1600 }); // Set standard paper-ish size

        await page.pdf({
            path: 'MyPlan_User_Guide.pdf',
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                bottom: '20px',
                left: '20px',
                right: '20px'
            }
        });

        console.log('PDF Generated Successfully: MyPlan_User_Guide.pdf');

    } catch (error) {
        console.error('Error generating guide:', error);
    } finally {
        await browser.close();
    }
}

generateUserGuide();
