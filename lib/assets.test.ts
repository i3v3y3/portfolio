import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

/**
 * Asset existence.
 *
 * The CV download is the single action a recruiter takes on this site. The
 * fork moved the file tree, which is exactly how the 404 this test guards
 * against gets reintroduced. Cheap test, expensive failure.
 */
describe('public assets', () => {
  const pub = path.join(process.cwd(), 'public')

  it.each(['Ivy_Matobori_Resume.pdf'])('%s exists and is non-empty', (file) => {
    const p = path.join(pub, file)
    expect(fs.existsSync(p), `${file} missing from public/`).toBe(true)
    expect(fs.statSync(p).size).toBeGreaterThan(1000)
  })

  it('publishes only the general CV, not a role-tailored one', () => {
    // Anything in public/ is fetchable whether or not a page links to it. The
    // tailored variants carry Ivy's phone number and name the employer they
    // were written for, so they are sent directly and never deployed. They live
    // outside this repo, alongside the .tex they are built from.
    const pdfs = fs.readdirSync(pub).filter((f) => f.toLowerCase().endsWith('.pdf'))
    expect(pdfs.sort()).toEqual(['Ivy_Matobori_Resume.pdf'])
  })

  it('the CV opens in a new tab for reading, not a forced save', () => {
    // Deliberately no `download` attribute: a reader should be able to skim the
    // CV in the browser's own viewer and save it from there if they want it.
    // The attribute would bypass the preview and drop a file on their disk.
    const hero = fs.readFileSync(path.join(process.cwd(), 'components', 'Hero.tsx'), 'utf8')
    const cvLink = hero.slice(hero.indexOf('Ivy_Matobori_Resume.pdf'))
    expect(cvLink, 'CV link should open in a new tab').toMatch(/target="_blank"/)
    expect(cvLink, 'a new-tab link needs rel="noopener"').toMatch(/rel="noopener noreferrer"/)
    expect(hero, 'the download attribute forces a save and skips the preview').not.toMatch(
      /download="Ivy_Matobori_Resume\.pdf"/,
    )
  })

  it('carries no assets belonging to the source repo', () => {
    const strays = ['about-me.png', 'avatar.jpg']
      .filter((f) => fs.existsSync(path.join(pub, f)))
    expect(strays, `source-repo assets still present: ${strays.join(', ')}`).toEqual([])
  })
})
