<template>
  <div class="scroll" @scroll="scrollEvent" :style="{height: screenHeight + 'px'}">
    <table class="scroll-table scroll-table-fixed">
      <thead class="scroll-thead" >
      <tr>
        <th>时间</th>
        <th>信息</th>
      </tr>
      </thead>
    </table>
    <div :style="{height: tableHeight + 'px'}">
      <table class="scroll-table scroll-table-border" >
        <tbody ref="tableBodyRef" class="scroll-tbody" :style="{transform: getTransForm}">
<!--        <tr v-for="data in visibleData" :key="JSON.stringify(data)" :style="{height: itemSize + 'px'}">-->
        <tr v-for="(data) in visibleData" :key="JSON.stringify(data)" :id="data.index" >
          <td>{{ data.time }}</td>
          <td>{{ data.message }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, onUpdated, reactive, ref, toRefs, watch } from "vue";
import { LogCenterList } from "@/utils/response";

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
      default: 100,
    },
  },
  setup(props: any) {
    const logListData = ref<LogCenterList[]>(props.dataSource)
    const tableBodyRef = ref()
    const tableState = reactive({
      start: 0,
      end: 10,
      startOffset: 0,
      screenHeight: 500,
      positions: [] as ItemPosition[],
    })
    const tableHeight = computed(() => {
      // return tableState.positions[tableState.positions.length - 1]?.bottom
      return logListData.value.length * props.itemSize
    })
    const visibleCount = computed(() => {
      return Math.ceil(tableState.screenHeight / props.itemSize)
    })
    const visibleData = computed(() => {
      // return logListData.value.slice(tableState.start, Math.min(tableState.end, logListData.value.length))
      const start = tableState.start - aboveCount()
      const end = tableState.end + belowCount()
      return logListData.value.slice(start, end)
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
      let scrollTop = event.target.scrollTop
      tableState.start = Math.floor(scrollTop / props.itemSize)
      tableState.end = tableState.start + visibleCount.value
      tableState.startOffset = scrollTop - (scrollTop % props.itemSize)
    }
    const initPositions = () => {
      tableState.positions = logListData.value.map((item: LogCenterList, index: number) => ({
        index, height: props.itemSize, top: index * props.itemSize,
        bottom: (index + 1) * props.itemSize
      }))
    }
    const updatePositions = () => {
      let nodes = tableBodyRef.value?.children
      nodes.forEach((node: HTMLDivElement)=> {
        let rect = node.getBoundingClientRect()
        let height = rect.height
        let index = parseInt(node.id, 10)
        let oldHeight = tableState.positions[index].height
        let dValue = oldHeight - height
        //存在差值
        if (dValue) {
          tableState.positions[index].bottom = tableState.positions[index].bottom - dValue
          tableState.positions[index].height = height
        }
      })
    }
    onMounted(() => {
      tableState.end = tableState.start + visibleCount.value
      initPositions()
    })
    onUpdated(() => {
      updatePositions()
    })
    watch(() => props.dataSource, (value) => {
      logListData.value = value
      initPositions()
    })

    return {
      tableBodyRef,
      tableHeight,
      visibleData,
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
}
.scroll-table {
  width: 100%;
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
