import mockFs from 'mock-fs'
import path from 'path'

export function mock (filesystem: { [key: string]: any }) {
  return mockFs({
    ...filesystem,
    'node_modules': mockFs.load(path.resolve(process.cwd(), 'node_modules')),
  }, { createCwd: false })
}

export function restore() {
  mockFs.restore()
}
