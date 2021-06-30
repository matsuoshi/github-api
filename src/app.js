const _ = require('lodash')
const axios = require('axios')
const dayjs = require('dayjs')

module.exports = {
  /**
   * main
   */
  main() {
    this.getPullRequests()
      .then(pr => {
        const result = this.countAndOrderByLoginName(this.filterByDate(pr))
        console.log(result)
      })
  },

  /**
   * GitHub API からクローズ済みプルリクエスト 最大100件を取得
   * @param params
   * @returns {Promise}
   */
  async getPullRequests(params = {}) {
    params = Object.assign({
      per_page: 100,
      state: 'closed',
    }, params)

    return axios
      .get('https://api.github.com/repos/ec-cube/ec-cube/pulls', {params})
      .then(response => response.data)
  },

  /**
   * 直近1年にマージされたPRをフィルタリングして返す
   * @param pullRequests
   * @returns {*}
   */
  filterByDate(pullRequests) {
    const thresholdDate = dayjs().subtract(1, 'year')
    return pullRequests.filter(pr => {
      return dayjs(pr.merged_at) >= thresholdDate
    })
  },

  /**
   * ユーザIDをカウントして、降順にソートして返す
   * @param pullRequests
   * @returns {*}
   */
  countAndOrderByLoginName(pullRequests) {
    return _(pullRequests)
      .countBy('user.login')
      .map((count, user) => {
        return {count, user}
      })
      .orderBy('count', 'desc')
      .value()
  }
}
