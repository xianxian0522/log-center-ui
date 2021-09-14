<template>
  <div >
    <div v-if="logListData?.length === 0">
      <a-empty :description="'暂无数据'" :image="simpleImage" />
    </div>
    <div v-else>
      <table class="scroll-table" v-if="!isShowContext" aria-describedby="head">
        <thead class="scroll-thead" >
        <tr>
          <th id="time">时间</th>
          <th id="message">信息</th>
        </tr>
        </thead>
      </table>
      <div class="scroll" @scroll="scrollEvent" :style="{height: screenHeight + 'px'}">
        <div >
          <table class="scroll-table scroll-table-border" aria-describedby="message" aria-hidden="true">
            <tbody ref="tableBodyRef" class="scroll-tbody" :style="{transform: getTransForm}">
            <!--        <tr v-for="data in visibleData" :key="JSON.stringify(data)" :style="{height: itemSize + 'px'}">-->
            <tr v-for="(data) in visibleData" :key="JSON.stringify(data)" :id="data.index" >
              <td>{{ data.time }}</td>
              <td>
                <div v-if="!isShowContext">{{ data.message }}</div>
                <div v-else>
                  <slot :logContext="data"></slot>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="page-btns">
      <a-button type="primary" :disabled="isTop" @click="lastPageClick">上一页</a-button>
      <a-button type="primary" :disabled="isBottom" @click="nextPAgeClick">下一页</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, onUpdated, reactive, ref, toRefs, watch } from "vue";
import { LogCenterList, LogSearchResponse } from "@/utils/response";
import { Empty } from "ant-design-vue";

interface ItemPosition {
  index: number; // 当前pos对应的元素的下标
  top: number; // 顶部位置
  bottom: number; // 底部位置
  height: number; // 元素高度
}

export default {
  name: "ScrollTable",
  props: {
    dataSource: Array,
    itemSize: {
      type: Number,
      default: 40,
    },
    screenAllHeight: {
      type: Number,
      default: 500,
    },
    isShowContext: Boolean,
  },
  emits: ['nextPageLog', 'lastPageLog'],
  setup(props: any, {emit}: any) {
    const tableBodyRef = ref()
    const logListData = ref<LogCenterList[]>(props.dataSource)
    const pageInfo = reactive({
      isBottom: true,
      isTop: true,
      lastPageStartTime: '',
      nextPageStartTime: '',
    })
    const tableState = reactive({
      start: 0,
      end: 10,
      startOffset: 0,
      screenHeight: 500,
      positions: [] as ItemPosition[],
    })
    const tableHeight = computed(() => {
      return tableState.positions[tableState.positions.length - 1]?.bottom
      // return logListData.value.length * props.itemSize
    })
    const visibleCount = computed(() => {
      return Math.ceil(tableState.screenHeight / props.itemSize)
    })
    const visibleData = computed(() => {
      const start = tableState.start > 2 ? tableState.start - 2 : tableState.start
      const min = Math.min(tableState.end, logListData.value.length)
      const end = min < logListData.value.length - 2 ? min - 2 : min
      return logListData.value.slice(start, end)
    })
    const getTransForm = computed(() => {
      return `translateY(${tableState.startOffset}px)`
    })
    const scrollEvent = (event: any) => {
      updatePositions()
      let scrollTop = event.target.scrollTop
      tableState.start = getStartIndex(scrollTop)
      tableState.end = tableState.start + visibleCount.value
      tableState.startOffset = tableState.positions[tableState.start]?.top
    }
    // 获取列表起始索引
    const getStartIndex = (scrollTop = 0) => {
      return binarySearch(tableState.positions, scrollTop)
    }
    // 二分法查找
    const binarySearch = (list: ItemPosition[], value: number) => {
      let start = 0
      let end = list.length - 1
      let tempIndex = 0
      while(start <= end){
        let midIndex = Math.floor((start + end) / 2)
        let midValue = list[midIndex].bottom
        if(midValue === value){
          return midIndex + 1
        } else if(midValue < value) {
          start = midIndex + 1
        } else if(midValue > value) {
          if (tempIndex === 0 || tempIndex > midIndex) {
            tempIndex = midIndex
          }
          end = end - 1
        }
      }
      return tempIndex
    }
    const initPositions = () => {
      tableState.positions = logListData.value.map((item: LogCenterList, index: number) => ({
        index, height: props.itemSize, top: index * props.itemSize,
        bottom: (index + 1) * props.itemSize
      }))
    }
    const updatePositions = () => {
      let nodes = tableBodyRef.value?.children
      nodes?.forEach((node: HTMLDivElement)=> {
        let rect = node.getBoundingClientRect()
        let height = rect.height
        let index = parseInt(node.id, 10)
        let oldHeight = tableState.positions[index].height
        let dValue = oldHeight - height
        //存在差值
        if (dValue) {
          tableState.positions[index].height = height
          if (index === 0) {
            tableState.positions[index].bottom = height
          } else {
            tableState.positions[index].bottom = tableState.positions[index - 1].bottom + tableState.positions[index].height
          }
          for (let i = index + 1; i < logListData.value.length; i++ ) {
            tableState.positions[i].top = tableState.positions[i - 1].bottom;
            tableState.positions[i].bottom = tableState.positions[i - 1].bottom + tableState.positions[i].height
          }
        }
      })
    }
    const changeScreenHeight = () => {
      tableState.screenHeight = logListData.value.length === 0 ? 382 : props.screenAllHeight
    }

    const changePageInfo = (value: LogSearchResponse) => {
      pageInfo.isBottom = value.isBottom
      pageInfo.isTop = value.isTop
      pageInfo.lastPageStartTime = value.lastPageStartTime
      pageInfo.nextPageStartTime = value.nextPageStartTime
    }
    const lastPageClick = () => {
      emit('lastPageLog', pageInfo.lastPageStartTime)
    }
    const nextPAgeClick = () => {
      emit('nextPageLog', pageInfo.nextPageStartTime)
    }

    onMounted(() => {
      tableState.end = tableState.start + visibleCount.value
      changeScreenHeight()
      initPositions()
    })
    onUpdated(() => {
      updatePositions()
    })

    watch(() => props.dataSource, (value) => {
      logListData.value = value
      changeScreenHeight()
      initPositions()
    })

    return {
      tableBodyRef,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      tableHeight,
      visibleData,
      logListData,
      getTransForm,
      ...toRefs(tableState),
      ...toRefs(pageInfo),
      scrollEvent,
      changePageInfo,
      lastPageClick,
      nextPAgeClick,
    }
  }
};
</script>

<style scoped lang="less">
.scroll {
  overflow-y: auto;
  //margin-top: -260px;
  //padding-top: 260px;
  //box-sizing: content-box;

  scrollbar-width: none;
}
.scroll::-webkit-scrollbar {
  width: 0;
}
.scroll-table {
  width: 100%;
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
}
.scroll-table-border {
  border-collapse: separate;
  border-spacing: 0;
}
.scroll-table-fixed {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 1;
}
.scroll-thead > tr > th {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  text-align: left;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.3s ease;
}
.scroll-thead > tr > th, .scroll-tbody > tr > td {
  padding: 16px 16px;
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
}
.scroll-tbody > tr td:nth-of-type(1), .scroll-thead > tr th:nth-of-type(1) {
  width: 200px;
}
.scroll-tbody > tr > td {
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.3s;
}
.scroll-tbody tr:hover {
  background: #e6f7ff;
}

.page-btns {
  text-align: right;
  margin-top: 20px;

  button {
    margin-left: 20px;
  }
}
</style>
