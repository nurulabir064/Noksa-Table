import test from 'node:test'
import assert from 'node:assert/strict'
import { siteConfig, isDemoContent } from '../src/config/site.js'

test('default restaurant profile has valid public configuration', () => {
  assert.equal(siteConfig.id, 'noksha-table')
  assert.ok(siteConfig.brandName.trim())
  assert.ok(siteConfig.siteUrl.startsWith('https://'))
  assert.ok(['demo', 'live'].includes(siteConfig.contentMode))
  assert.equal(typeof siteConfig.features.whatsappOrdering, 'boolean')
  assert.equal(typeof siteConfig.features.reservationRequests, 'boolean')
  assert.equal(isDemoContent, siteConfig.contentMode === 'demo')
})

test('reservation requests remain disabled for the fictional concept profile', () => {
  assert.equal(siteConfig.features.reservationRequests, false)
  assert.equal(isDemoContent, true)
})