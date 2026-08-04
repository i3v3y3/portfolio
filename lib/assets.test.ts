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

  it.each([
    'Ivy_Matobori_Resume.pdf',
    'Ivy_Matobori_Resume_OctaviaCarbon_IC.pdf',
  ])('%s exists and is non-empty', (file) => {
    const p = path.join(pub, file)
    expect(fs.existsSync(p), `${file} missing from public/`).toBe(true)
    expect(fs.statSync(p).size).toBeGreaterThan(1000)
  })

  it('the CV button actually downloads rather than opening inline', () => {
    // GitHub Pages sends application/pdf with no Content-Disposition, so
    // without an explicit download attribute the browser renders the file in a
    // tab and a button labelled "Download CV" does not download anything.
    const hero = fs.readFileSync(
      path.join(process.cwd(), 'components', 'Hero.tsx'),
      'utf8',
    )
    expect(hero, 'CV link lost its download attribute').toMatch(
      /download="Ivy_Matobori_Resume\.pdf"/,
    )
  })

  it('carries no assets belonging to the source repo', () => {
    const strays = ['about-me.png', 'avatar.jpg']
      .filter((f) => fs.existsSync(path.join(pub, f)))
    expect(strays, `source-repo assets still present: ${strays.join(', ')}`).toEqual([])
  })
})
