import puppeteer from "puppeteer-core";
import type { Browser } from "puppeteer-core";

let cachedPath: string | null = null;
let downloadPromise: Promise<string> | null = null;

async function getExecutablePath(): Promise<string> {
  // ! Réutilise le chemin Chromium dans le processus et évite plusieurs extractions concurrentes.
  if (cachedPath) return cachedPath;
  if (!downloadPromise) {
    const chromium = (await import("@sparticuz/chromium")).default;
    downloadPromise = chromium
      .executablePath()
      .then((path) => {
        cachedPath = path;
        return path;
      })
      .catch((e) => {
        downloadPromise = null;
        throw e;
      });
  }
  return downloadPromise;
}

export async function generatePDF(html: string): Promise<Buffer> {
  // ! Chromium fournit le moteur de rendu; Puppeteer pilote la page et l'impression PDF.
  const chromium = (await import("@sparticuz/chromium")).default;
  const browser: Browser = await puppeteer.launch({
    args: await puppeteer.defaultArgs({
      args: chromium.args,
      headless: "shell",
    }),
    executablePath: await getExecutablePath(),
    headless: "shell",
    defaultViewport: { width: 794, height: 1123 }, // ? A4 en px
  });

  try {
    const page = await browser.newPage();
    // ? Le contenu est autonome (HTML/CSS construit par la route), puis imprimé en A4 avec fond.
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
