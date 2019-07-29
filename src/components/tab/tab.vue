/*
 * @Author: yongtian.hong
 * @Date: 2018-08-01 15:37:12
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-12 13:22:07
 * @Description: tab横向滚动组件
  */

<style lang="scss" scoped>
.tabs-wraper {
  padding: 0;
  margin: 0;
  overflow: hidden;
  background: #fff;
  .tabs-content {
    display: flex;
    flex-wrap: nowrap;
    min-width: 100%;
    // margin: 0 auto;
    justify-content: space-around;
    box-sizing: border-box;
    .tabItem {
      
      position: relative;
      display: flex;
      flex-wrap: nowrap;
      padding: computed(20) computed(30);
      font-size: computed(30);
      font-family: "PingFang-SC-Medium";
      color: $text-regular;
      cursor: pointer;
      .label {
        position: relative;
        .badge {
          position: absolute;
          top: -6px;
          right: -12px;
          z-index: 10;
          color: #fff;
          font-size: computed(20);
          width: computed(32);
          height: computed(32);
          line-height: computed(32);
          text-align: center;
          background: $domaincolor;
          border-radius: 50%;
        }
      }
    }
    .tabActiveLeft,
    .tabActiveRight {
      // position: relative;
      width: 100%;
      color: $domaincolor;
      text-align: center;
    }
    .tabActiveLeft:after,
    .tabActiveRight:after {
      content: "";
      position: absolute;
      top: 138%;
      width: 100%;
      height: 2px;
      border-radius: 1px;
      background-color: $domaincolor;
      animation: lineAnimation 0.5s backwards;
    }
    .tabActiveLeft:after {
      left: 0px;
    }
    .tabActiveRight:after {
      right: 0px;
    }
  }
  @keyframes lineAnimation {
    from {
      width: 10%;
    }
    to {
      width: 100%;
    }
  }
}
</style>
<template>
  <div class="tabs-wraper">
    <ul class="tabs-content">
      <li
        v-for="(item,$index) in tabs"
        @click="onTabChange(item,$index)"
        :key="$index"
        class="tabItem"
        ref="tabItem"
      >
        <div :class="['label',item.active]">
          <span>{{item[label]}}</span>
          <div class="badge" v-if="item.num">{{item.num}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { setTimeout } from "timers";
export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    onChange: {
      type: Function,
      default: null
    },
    tabAlign: {
      type: String,
      default: "center"
    },
    label: {
      type: String,
      default: "name"
    }
  },

  data() {
    return {
      sIndex: this.index,
      tabs: []
    };
  },
  methods: {
    // 初始化滚动条

    // 设置选中样式
    setActiveTab(item, $index) {
      item.active = $index > this.sIndex ? "tabActiveLeft" : "tabActiveRight";
      this.tabs[this.sIndex].active = "";
      this.$set(this.tabs, $index, item);
    },
    // tab点击事件
    onTabChange(item, $index) {
      if (this.sIndex == $index) return;
      this.setActiveTab(item, $index);
      // 缓存当前选中按钮
      this.sIndex = $index;
      //控制选中样式切换
      typeof this.onChange === "function"
        ? this.onChange(item, $index)
        : console.log("onChange must be a function");
    },
    // 初始化选中状态
    initState() {
      this.tabs = this.data;
      this.sIndex=this.index;
      this.tabs.forEach((tab, index) => {
        tab.active = index == this.sIndex ? "tabActiveLeft" : "";
      });
    }
  },

  onHide(){
    //  Object.assign(this.$data, this.$options.data());
  },

  onLoad() {
    this.initState();
  },
};
</script>