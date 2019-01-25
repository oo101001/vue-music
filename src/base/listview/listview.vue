<template>
  <scroll @scroll="scroll" :data="data" :probeType="probeType" :listenScroll="listenScroll" class="listview" ref="listview">
    <ul>
      <li v-for="(group, index) in data" class="list-group" ref="listGroup" :key="index">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li v-for="(item, idx) in group.items" class="list-group-item" :key="idx">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <!--<div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove"-->
    <!--@touchend.stop>-->
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" :data-index="index" class="item"
            :class="{'current':currentIndex===index}"
            :key="index"
        >{{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'

const ANCHOR_HEIGHT = 18

export default {
  name: 'listview',
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  computed: {
    shortcutList () {
      return this.data.map(group => {
        return group.title.substr(0, 1)
      })
    }
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0
    }
  },
  created () {
    // 不需要观测变量可放created
    this.probeType = 3
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
  },
  methods: {
    onShortcutTouchStart (e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      // 记录第一次touch时的Y值及下标
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      // touch到对应下标
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      // 记录move时的Y值
      this.touch.y2 = firstTouch.pageY
      // 计算出move后pageY的差值再除锚点高度向下取整得出move后所在的锚点下标(| 0 = Math.floor())
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      // 得到move后的差值下标后,再加上第一次touch时记录的下标值
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    _calculateHeight () {
      // 获取每个listGroup(li)的累加高度
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    _scrollTo (index) {
      // 如果index为null 且不为0 (处理顶部底部点击)
      if (!index && index !== 0) {
        return
      }
      // move时超出顶部底部限制
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      // 调用better-scroll scrollToElement方法 获取滚动区域DOM使用该方便,传入需要滚动到的DOM下标,即时滚动所以滚动动画时长为0
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i] // 元素TOP高度
        let height2 = listHeight[i + 1] // 元素BOTTOM高度
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限(减2:手动添加了第一个TOP:0,另外长度起始是1)
      this.currentIndex = listHeight.length - 2
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background

    .list-group
      padding-bottom: 30px

      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background

      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px

        .avatar
          width: 50px
          height: 50px
          border-radius: 50%

        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium

    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica

      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small

        &.current
          color: $color-theme

    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%

      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background

    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
