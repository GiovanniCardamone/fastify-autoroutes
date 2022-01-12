import fs from 'fs'
import { expect } from 'chai'

import { getNameInfo, Method, NameInfo } from '../../src/bin/utils/extract'
import {
  buildBaseInterface,
  buildSpecificMethodInterface,
  buildSpecificMethodImplementation,
} from '../../src/bin/utils/generateTs'

const SUGGEST_RESOURCE: Method[] = ['get', 'post']
const SUGGEST_ACTION: Method[] = ['get', 'post']
const SUGGEST_SPECIFIC: Method[] = ['get', 'put', 'post', 'delete']
const SUGGEST_FIELD: Method[] = ['get', 'patch']

function read(path: string): string {
  return fs.readFileSync(path, 'utf-8').trimEnd()
}

describe('bin', () => {
  describe('#resource', () => {
    it('base resource', (done) => {
      const v: NameInfo = {
        name: 'Users',
        parameters: [],
        suggest: SUGGEST_RESOURCE,
        type: 'RESOURCE',
        resource: 'User',
        action: undefined,
      }

      expect(getNameInfo('users'), 'no base /').to.deep.equal(v)
      expect(getNameInfo('/users'), 'with base /').to.deep.equal(v)

      expect(buildBaseInterface(v)).to.be.equal(
        read('tests/bin/assets/resources/1')
      )

      expect(buildSpecificMethodInterface('get', v)).to.be.equal(
        read('tests/bin/assets/resources/1_get')
      )

      expect(buildSpecificMethodInterface('post', v)).to.be.equal(
        read('tests/bin/assets/resources/1_post')
      )

      done()
    })

    it('nested resource', (done) => {
      const v: NameInfo = {
        name: 'UserByIdPosts',
        parameters: ['userId'],
        suggest: SUGGEST_RESOURCE,
        type: 'RESOURCE',
        resource: 'Post',
        action: undefined,
      }

      expect(getNameInfo('users/:userId/posts'), 'no base /').to.deep.equal(v)
      expect(getNameInfo('/users/:userId/posts'), 'with base /').to.deep.equal(
        v
      )

      done()
    })

    it('nested nested resource', (done) => {
      const v: NameInfo = {
        name: 'UserByIdPostByIdComments',
        parameters: ['userId', 'postId'],
        suggest: SUGGEST_RESOURCE,
        type: 'RESOURCE',
        resource: 'Comment',
        action: undefined,
      }

      expect(
        getNameInfo('users/:userId/posts/:postId/comments'),
        'no base /'
      ).to.deep.equal(v)

      expect(
        getNameInfo('/users/:userId/posts/:postId/comments'),
        'with base /'
      ).to.deep.equal(v)

      done()
    })
  })

  describe('#value', () => {
    it('base value', (done) => {
      const v: NameInfo = {
        name: 'UserById',
        parameters: ['userId'],
        suggest: SUGGEST_SPECIFIC,
        type: 'SPECIFIC',
        resource: 'User',
        action: undefined,
      }

      expect(getNameInfo('users/:userId'), 'no base /').to.deep.equal(v)
      expect(getNameInfo('/users/:userId'), 'with base /').to.deep.equal(v)

      done()
    })

    it('nested value', (done) => {
      const v: NameInfo = {
        name: 'UserByIdPostById',
        parameters: ['userId', 'postId'],
        suggest: SUGGEST_SPECIFIC,
        type: 'SPECIFIC',
        resource: 'Post',
        action: undefined,
      }

      expect(
        getNameInfo('users/:userId/posts/:postId'),
        'no base /'
      ).to.deep.equal(v)
      expect(
        getNameInfo('/users/:userId/posts/:postId'),
        'with base /'
      ).to.deep.equal(v)

      done()
    })
  })

  describe('#action', () => {
    it('base action', (done) => {
      const v: NameInfo = {
        name: 'Status',
        parameters: [],
        suggest: SUGGEST_ACTION,
        type: 'ACTION',
        resource: undefined,
        action: 'Status',
      }

      expect(getNameInfo('status'), 'no base /').to.deep.equal(v)
      expect(getNameInfo('/status'), 'with base /').to.deep.equal(v)

      done()
    })

    it('nested action', (done) => {
      const v: NameInfo = {
        name: 'LockUsers',
        parameters: [],
        suggest: SUGGEST_ACTION,
        type: 'ACTION',
        resource: 'User',
        action: 'Lock',
      }

      expect(getNameInfo('users/lock'), 'no base /').to.deep.equal(v)
      expect(getNameInfo('/users/lock'), 'with base /').to.deep.equal(v)

      done()
    })

    it('nested action value', (done) => {
      const v: NameInfo = {
        name: 'BanUserById',
        parameters: ['userId'],
        suggest: SUGGEST_ACTION,
        type: 'ACTION',
        resource: 'User',
        action: 'Ban',
      }

      expect(getNameInfo('users/:userId/ban'), 'no base /').to.deep.equal(v)
      expect(getNameInfo('/users/:userId/ban'), 'with base /').to.deep.equal(v)

      done()
    })
  })
})
