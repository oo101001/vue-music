import {playMode} from 'common/js/config'
const state = {
  singer: {}, // 歌手
  playing: false, // 播放
  fullScreen: false, // 全屏
  playlist: [], // 播放列表
  sequenceList: [], // 播放序列
  mode: playMode.sequence, // 播放模式（默认正序）
  currentIndex: -1 // 当前索引
}

export default state
