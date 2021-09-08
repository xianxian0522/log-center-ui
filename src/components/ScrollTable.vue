<template>
  <div >
    <div v-if="logListData?.length === 0">
      <a-empty :description="'暂无数据'" :image="simpleImage" />
    </div>
    <div v-else>
      <table class="scroll-table" v-if="!isShowContext">
        <thead class="scroll-thead" >
        <tr>
          <th>时间</th>
          <th>信息</th>
        </tr>
        </thead>
      </table>
      <div class="scroll" @scroll="scrollEvent" :style="{height: screenHeight + 'px'}">
        <div >
          <table class="scroll-table scroll-table-border" >
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
  </div>
</template>

<script lang="ts">
import { computed, onMounted, onUpdated, reactive, ref, toRefs, watch } from "vue";
import { LogCenterList } from "@/utils/response";
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
      default: 50,
    },
    screenAllHeight: {
      type: Number,
      default: 500,
    },
    isShowContext: Boolean,
  },
  setup(props: any) {
    const tableBodyRef = ref()
    const logListData = ref<LogCenterList[]>(props.dataSource)
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
      return logListData.value.slice(tableState.start, Math.min(tableState.end, logListData.value.length))
      // let start = tableState.start - aboveCount()
      // let end = tableState.end + belowCount()
      // // if (end === logListData.value.length) {
      // //   start = end - visibleCount.value
      // // }
      // return logListData.value.slice(start, end)
    })
    const getTransForm = computed(() => {
      return `translateY(${tableState.startOffset}px)`
    })

    const aboveCount = () => {
      return Math.min(tableState.start, visibleCount.value)
    }
    const belowCount = () => {
      return Math.min(logListData.value.length - tableState.end, visibleCount.value)
    }
    const scrollEvent = (event: any) => {
      updatePositions()
      let scrollTop = event.target.scrollTop
      // tableState.start = Math.floor(scrollTop / props.itemSize)
      // tableState.end = tableState.start + visibleCount.value
      // tableState.startOffset = scrollTop - (scrollTop % props.itemSize)
      // console.log(tableState.start, tableState.end, logListData.value.length, '===', scrollTop, (scrollTop % props.itemSize))
      tableState.start = getStartIndex(scrollTop)
      tableState.end = tableState.start + visibleCount.value
      // if(tableState.start >= 1){
      tableState.startOffset = tableState.positions[tableState.start]?.top
      // }
      // else{
      //   tableState.startOffset = 0
      // }
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
      scrollEvent,
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
  //width: 0;
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
</style>
