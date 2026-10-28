import assert from 'node:assert/strict'
import { chromium } from 'playwright'

const baseURL = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3123'
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })

async function run() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.getByRole('heading', { name: 'Tiket Event JakCloth' }).waitFor()
  await page.getByRole('heading', { name: 'Panggungnya berlalu. Musiknya tetap hidup.' }).waitFor()
  const livePrecedesTickets = await page.locator('#live').evaluate(el =>
    Boolean(el.compareDocumentPosition(document.querySelector('#tickets')) & Node.DOCUMENT_POSITION_FOLLOWING)
  )
  assert.equal(livePrecedesTickets, true)
  console.log('PASS live and albums take priority over inactive ticketing')
  assert.equal(await page.getByRole('button', { name: 'Tiket segera tersedia' }).isDisabled(), true)
  assert.equal(await page.getByRole('button', { name: 'Lihat contoh QR' }).count(), 4)
  assert.equal(await page.getByText(/Stok:/).count(), 0)
  assert.equal(await page.getByRole('heading', { name: 'Kompilasi Album JakCloth' }).count(), 1)
  assert.equal(await page.getByText('Manifesto Gigs Bawah Tanah', { exact: true }).count(), 1)
  // Product explanations belong in documentation, not on the listening screen.
  assert.equal(await page.getByText(/Demo: satu lagu pertama per album/).count(), 0)
  assert.equal(await page.getByText(/Pada rilis lengkap: 3 pemutaran gratis per album/).count(), 0)
  const albumCover = page.getByRole('button', { name: 'Perbesar artwork Romantika Urban Kontemporer' }).first().locator('img')
  assert.equal(await albumCover.evaluate(image => getComputedStyle(image).objectFit), 'contain')
  console.log('PASS album cover fits fully and no internal demo copy')
  assert.equal(await page.getByRole('heading', { name: 'Artis Favorit' }).count(), 0)
  assert.equal(await page.getByRole('button', { name: '+ Ikuti' }).count(), 0)
  assert.equal(await page.locator('#artists').count(), 0)
  assert.equal(await page.locator('#fan-choice').count(), 1)
  assert.equal(await page.getByRole('link', { name: 'Fan Choice' }).getAttribute('href'), '#fan-choice')
  const menuLabels = await page.getByRole('navigation', { name: 'Navigasi JakCloth' }).locator('a').allTextContents()
  assert.deepEqual(menuLabels, ['Live', 'Kompilasi', 'Tiket', 'Merch', 'Fan Choice'])
  assert.equal(await page.getByText('Stage Crowd Voting').count(), 0)
  // Homepage funnel: consume music, see tickets and merchandise, then Fan Choice.
  const sectionOrder = await page.evaluate(() => {
    const merch = document.getElementById('merch')
    const fan = document.getElementById('fan-choice')
    const promo = [...document.querySelectorAll('h3')].find(h => h.textContent?.trim() === 'Promo Brand di Event')
    return Boolean(merch && fan && promo &&
      merch.compareDocumentPosition(promo) & Node.DOCUMENT_POSITION_FOLLOWING &&
      promo.compareDocumentPosition(fan) & Node.DOCUMENT_POSITION_FOLLOWING)
  })
  assert.equal(sectionOrder, true, 'Fan Choice must follow Promo Brand as the last homepage section')
  console.log('PASS Fan Choice follows Promo Brand in homepage; redundant artist follow panel removed')

  // Tapping a cover opens the lightbox without opening the album track list.
  await page.getByRole('button', { name: 'Perbesar artwork Romantika Urban Kontemporer' }).first().click()
  await page.getByRole('dialog', { name: /Foto diperbesar/ }).waitFor()
  assert.equal(await page.getByRole('button', { name: '1. bukan tentangmu Daun Jatuh 04:12' }).count(), 0)
  await page.getByRole('button', { name: 'Tutup foto' }).click()
  assert.equal(await page.getByRole('dialog').count(), 0)
  console.log('PASS photo opens and closes without affecting album selection')

  // Tapping the album title opens songs; tapping the song shows player there, not in Live.
  await page.getByRole('button', { name: 'Lihat daftar lagu' }).first().click()
  const daun = page.getByRole('button', { name: /1\. bukan tentangmu.*Daun Jatuh/ })
  await daun.waitFor()
  await daun.click()
  await page.locator('#inline-player-r1 audio').waitFor()
  assert.equal(await page.getByText(/Lagu demo gratis/).count(), 0)
  assert.equal(await page.getByText('Audio menyusul').count() >= 3, true)
  assert.equal(await page.locator('#live h2').textContent().then(x => x.includes('For Revenge')), true)
  console.log('PASS compilation player opens inline; Live performer unchanged')

  // There must be no mid-song 15-second modal; invitations happen after full songs.
  await page.locator('#inline-player-r1 audio').evaluate(el => el.dispatchEvent(new Event('timeupdate', { bubbles: true })))
  assert.equal(await page.getByRole('heading', { name: /Dukung Artis, Buka/ }).count(), 0)
  await page.locator('#inline-player-r1 audio').evaluate(el => el.dispatchEvent(new Event('ended', { bubbles: true })))
  await page.getByText(/Suka lagu ini\? Dukung para artis/).waitFor()
  assert.equal(await page.getByRole('button', { name: /Dukung album.*Demo/ }).count(), 1)
  console.log('PASS full compilation song with optional support after natural ending')
  // Checkout CTA is available after a complete listen; test before changing players.
  await page.getByRole('button', { name: /Dukung album.*Demo/ }).click()
  await page.getByRole('heading', { name: 'Simulasi Checkout JakCloth' }).waitFor()
  await page.locator('#support-amount').fill('20000')
  assert.equal(await page.getByText('Rp 20.000', { exact: true }).count(), 1)
  assert.equal(await page.getByText(/Tidak ada QRIS asli/).count(), 1)
  await page.getByRole('button', { name: 'Batal / Kembali' }).click()
  console.log('PASS flexible demo checkout, custom amount and cancel')


  await page.locator('#live video').evaluate(el => el.dispatchEvent(new Event('ended', { bubbles: true })))
  await page.getByText(/Terima kasih sudah menikmati satu lagu lengkap/).waitFor()
  console.log('PASS full live demo song without interrupting playback')

  await page.getByRole('button', { name: /1\. bukan tentangmu.*Daun Jatuh/ }).click()
  assert.equal(await page.locator('#inline-player-r1').count(), 0)
  console.log('PASS tapping selected track closes its player')


  // Fan Choice is usable directly in the homepage without leaving the app.
  await page.getByRole('link', { name: 'Fan Choice' }).click()
  await page.locator('#fan-choice').getByRole('heading', { name: 'Fan Choice' }).waitFor()
  await page.locator('#fan-choice').getByRole('searchbox', { name: 'Cari artis, band, atau genre' }).fill('For Revenge')
  await page.locator('#fan-choice').getByRole('button', { name: '♡ Dukung' }).click()
  const homeSharePreview = page.getByRole('dialog', { name: 'Dukunganmu tersimpan!' })
  await homeSharePreview.waitFor()
  await homeSharePreview.getByText('Instagram').waitFor()
  await homeSharePreview.getByText('Facebook').waitFor()
  await homeSharePreview.getByText('TikTok').waitFor()
  await homeSharePreview.getByText('YouTube Shorts').waitFor()
  assert.equal(await homeSharePreview.locator('a').count(), 0, 'Visual-only preview must not contain social links')
  assert.equal(await homeSharePreview.getByRole('button', { name: 'Instagram' }).count(), 0, 'Social tiles are decorative, not buttons')
  await homeSharePreview.getByRole('button', { name: 'Nanti saja' }).click()
  assert.equal(await page.getByRole('dialog', { name: 'Dukunganmu tersimpan!' }).count(), 0)
  await page.locator('#fan-choice').getByRole('button', { name: '♥ Didukung' }).waitFor()
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.locator('#fan-choice').getByRole('button', { name: '♥ Didukung' }).waitFor()
  assert.equal(await page.evaluate(() => localStorage.getItem('jakcloth-fan-choice-share-preview-seen-v1')), '1')
  await page.locator('#fan-choice').getByRole('button', { name: 'Bandung' }).click()
  await page.locator('#fan-choice').getByRole('button', { name: '♡ Dukung' }).first().click()
  assert.equal(await page.getByRole('dialog', { name: 'Dukunganmu tersimpan!' }).count(), 0, 'No automatic popup after first support')
  await page.locator('#fan-choice').getByRole('button', { name: 'Bagikan dukungan' }).click()
  const manualSharePreview = page.getByRole('dialog', { name: 'Dukunganmu tersimpan!' })
  await manualSharePreview.waitFor()
  await manualSharePreview.getByText(/JakCloth Bandung/).waitFor()
  await page.keyboard.press('Escape')
  assert.equal(await page.getByRole('dialog', { name: 'Dukunganmu tersimpan!' }).count(), 0)
  console.log('PASS visual-only social share popup once, optional replay, dismissal and device persistence')

  // The app remains usable at narrow viewport, with no document-level overflow.
  const overflow = await page.evaluate(() => ({ body: document.body.scrollWidth, viewport: document.documentElement.clientWidth }))
  assert.ok(overflow.body <= overflow.viewport + 2, 'Mobile document horizontal overflow: '+JSON.stringify(overflow))
  assert.deepEqual(errors, [], 'Runtime errors: '+JSON.stringify(errors))
  console.log('PASS mobile viewport width and no JS runtime exceptions')
  await page.close()


  // Fan Choice is an interactive *local-only* demo, never a claimed public vote.
  const fan = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  const fanErrors = []
  fan.on('pageerror', error => fanErrors.push(error.message))
  await fan.goto(baseURL, { waitUntil: 'domcontentloaded' })
  await fan.getByRole('link', { name: 'Fan Choice' }).click()
  await fan.getByRole('heading', { name: 'Fan Choice' }).waitFor()
  await fan.getByText(/disimpan di browser perangkatmu/).waitFor()
  await fan.getByRole('searchbox', { name: 'Cari artis, band, atau genre' }).fill('For Revenge')
  await fan.getByRole('button', { name: '♡ Dukung' }).click()
  const standaloneShare = fan.getByRole('dialog', { name: 'Dukunganmu tersimpan!' })
  await standaloneShare.waitFor()
  await standaloneShare.getByRole('button', { name: 'Tutup pop-up berbagi' }).click()
  await fan.getByRole('button', { name: '♥ Didukung' }).waitFor()
  await fan.reload({ waitUntil: 'domcontentloaded' })
  await fan.getByRole('button', { name: '♥ Didukung' }).waitFor()
  await fan.getByRole('button', { name: 'Bandung' }).click()
  await fan.getByRole('button', { name: '♡ Dukung' }).first().waitFor()
  await fan.getByRole('button', { name: '♡ Dukung' }).first().click()
  assert.equal(await fan.getByRole('dialog', { name: 'Dukunganmu tersimpan!' }).count(), 0)
  await fan.getByRole('button', { name: 'Jakarta' }).click()
  await fan.getByRole('button', { name: '♥ Didukung' }).waitFor()
  console.log('PASS Fan Choice support persists and cities stay separate')

  await fan.getByRole('tab', { name: 'Usulkan artis baru' }).click()
  const optionalGenre = fan.getByRole('textbox', { name: 'Genre (opsional)' })
  assert.equal(await optionalGenre.inputValue(), '', 'Optional genre must be empty by default')
  await fan.getByPlaceholder('Contoh: nama band favorit').fill('Band Simulasi QA')
  await fan.getByRole('button', { name: 'Kirim usulan (demo)' }).click()
  await fan.getByText('Band Simulasi QA', { exact: true }).first().waitFor()
  await fan.reload({ waitUntil: 'domcontentloaded' })
  await fan.getByText('Band Simulasi QA', { exact: true }).first().waitFor()
  await fan.getByText('Genre tidak diisi · Usulanmu (demo)').waitFor()
  let saved = await fan.evaluate(() => JSON.parse(localStorage.getItem('jakcloth-fan-choice-demo-v1')))
  assert.equal(saved.suggestions[0].genre, '', 'Blank genre stays empty, never auto-classified')

  await fan.getByRole('tab', { name: 'Usulkan artis baru' }).click()
  await fan.getByPlaceholder('Contoh: nama band favorit').fill('Band Genre QA')
  await fan.getByRole('textbox', { name: 'Genre (opsional)' }).fill('  Post  punk  ')
  await fan.getByRole('button', { name: 'Kirim usulan (demo)' }).click()
  await fan.getByText('Band Genre QA', { exact: true }).first().waitFor()
  await fan.getByText('Genre usulan: Post punk (belum diverifikasi) · Usulanmu (demo)').waitFor()
  saved = await fan.evaluate(() => JSON.parse(localStorage.getItem('jakcloth-fan-choice-demo-v1')))
  assert.equal(saved.suggestions[1].genre, 'Post punk')
  console.log('PASS new artist suggestions persist with or without optional manually entered genre')

  await fan.getByRole('tab', { name: 'Usulkan artis baru' }).click()
  await fan.getByPlaceholder('Contoh: nama band favorit').fill('  FOR  revenge ')
  await fan.getByRole('button', { name: 'Kirim usulan (demo)' }).click()
  await fan.getByText(/Artis sudah ada di daftar/).waitFor()
  const stored = await fan.evaluate(() => JSON.parse(localStorage.getItem('jakcloth-fan-choice-demo-v1')))
  assert.equal(stored.suggestions.length, 2)
  // Jakarta For Revenge + Bandung For Revenge + two new proposed artists.
  assert.equal(stored.supports.length, 4)
  const fanOverflow = await fan.evaluate(() => ({ body: document.body.scrollWidth, viewport: document.documentElement.clientWidth }))
  assert.ok(fanOverflow.body <= fanOverflow.viewport + 2, 'Fan Choice mobile overflow: ' + JSON.stringify(fanOverflow))
  assert.deepEqual(fanErrors, [], 'Fan Choice runtime errors: ' + JSON.stringify(fanErrors))
  console.log('PASS duplicate artist prevention, valid data and mobile layout')
  // Standalone route and homepage use exactly the same underlying local state.
  await fan.goto(baseURL + '/fan-choice', { waitUntil: 'domcontentloaded' })
  await fan.getByText('Band Genre QA', { exact: true }).first().waitFor()
  await fan.getByRole('link', { name: /Kembali ke aplikasi/ }).click()
  await fan.locator('#fan-choice').getByText('Band Genre QA', { exact: true }).first().waitFor()
  const shared = await fan.evaluate(() => JSON.parse(localStorage.getItem('jakcloth-fan-choice-demo-v1')))
  assert.equal(shared.suggestions.length, 2)
  console.log('PASS standalone and homepage routes share the same Fan Choice data')
  await fan.close()

  const desktop = await browser.newPage({ viewport: { width: 1366, height: 900 } })
  await desktop.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await desktop.getByRole('heading', { name: 'Kompilasi Album JakCloth' }).waitFor()
  await desktop.getByRole('button', { name: 'Perbesar foto For Revenge Official Live Tee' }).click()
  await desktop.getByRole('dialog').waitFor()
  await desktop.keyboard.press('Escape')
  assert.equal(await desktop.getByRole('dialog').count(), 0)
  console.log('PASS desktop merchandise photo modal and Escape closing')
  await desktop.close()
}

try {
  await run()
  console.log('SMOKE QA PASSED')
} catch (error) {
  console.error('SMOKE QA FAILED', error)
  process.exitCode = 1
} finally {
  await browser.close()
}
