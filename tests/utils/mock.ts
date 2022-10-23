import mockFs from 'mock-fs'
import path from 'path'

export function mock(dir: string, filesystem: { [key: string]: any }): string {


  mockFs({
    [dir]: {
      ...filesystem,
    },
    'node_modules': mockFs.load(path.resolve(process.cwd(), 'node_modules')),
  }, { createCwd: true })

  return path.join(process.cwd(), dir)
}

export function restore() {
  mockFs.restore()
}
