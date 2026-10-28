import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function GET(request) {
  let browser = null;

  try {
    // 1. Configurer les options selon l'environnement (Local vs Production)
    const isLocal = process.env.NODE_ENV === 'development';
    
    const options = isLocal
      ? {
          // Remplacer par le chemin de votre Chrome local si vous utilisez puppeteer-core
          // (Sous Mac ex: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
          // (Sous Windows ex: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
          executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          headless: true,
        }
      : {
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        };

    // 2. Lancer le navigateur
    browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    // 3. Naviguer et effectuer l'action (Exemple : Capture d'écran)
    await page.goto('https://example.com');
    const screenshot = await page.screenshot({ type: 'png' });

    // 4. Fermer le navigateur
    await browser.close();

    // Retourner le résultat
    return new NextResponse(screenshot, {
      headers: { 'Content-Type': 'image/png' },
    });

  } catch (error) {
    console.error("Erreur Puppeteer:", error);
    if (browser) await browser.close();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
