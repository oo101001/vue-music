import {playMode} from 'common/js/config'
import {loadSearch, loadPlay} from 'common/js/cache'

const state = {
  singer: {}, // 歌手
  playing: false, // 播放
  fullScreen: false, // 全屏
  playlist: [], // 播放列表
  sequenceList: [], // 播放序列
  mode: playMode.sequence, // 播放模式（默认正序）
  currentIndex: -1, // 当前索引
  desc: {}, // 歌单详情
  topList: {}, // 排行
  searchHistory: loadSearch(), // 搜索历史
  playHistory: loadPlay() // 播放历史

}

export default state
