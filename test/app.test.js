const App = require('../src/app')
const MockDate = require('mockdate')

test('GitHub API から情報取得できる', async () => {
  const actual = await App.getPullRequests({per_page: 3})
  expect(actual.length).toBe(3)
})

test('ログインユーザをカウント集計して多い順にソート', () => {
  const actual = App.countAndOrderByLoginName([
    {user: {login: 'user1'}},
    {user: {login: 'user2'}},
    {user: {login: 'user3'}},
    {user: {login: 'user1'}},
    {user: {login: 'user3'}},
    {user: {login: 'user1'}},
  ])

  expect(actual).toStrictEqual([
    {user: 'user1', count: 3},
    {user: 'user3', count: 2},
    {user: 'user2', count: 1},
  ])
})

describe('時刻のテスト', () => {
  beforeEach(() => {
    MockDate.set('2021-01-01T00:00:00Z')
  })
  afterEach(() => {
    MockDate.reset()
  })

  test('直近1年にマージされたものでフィルタリング', () => {
    const actual = App.filterByDate([
      { id: 1, merged_at: '2020-01-02T00:00:00Z' },
      { id: 2, merged_at: '2020-01-01T00:00:00Z' },
      { id: 3, merged_at: '2019-12-31T23:59:59Z' },
      { id: 4, merged_at: '2019-12-30T00:00:00Z' },
      { id: 5, merged_at: null},
    ])
    const ids = actual.map(obj => obj.id)

    expect(ids).toStrictEqual([1, 2])
  })
})
