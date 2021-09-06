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
      <table class="scroll-table" >
        <tbody class="scroll-tbody" :style="{transform: getTransForm}">
        <tr v-for="data in visibleData" :key="JSON.stringify(data)" :style="{height: itemSize + 'px'}">
          <td>{{ data.time }}</td>
          <td>{{ data.message }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, reactive, toRefs } from "vue";

export default {
  name: "ScrollTable",
  props: {
    dataSource: Array,
    itemSize: {
      type: Number,
      default: 100,
    }
  },
  directives: {
    'resize': {
      beforeMount: function(el: any, binding: any) {
        let width = '', height = '';
        function get() {
          const elStyle = el.currentStyle ? el.currentStyle : document?.defaultView?.getComputedStyle(el, null);
          if (width !== elStyle.width || height !== elStyle.height) {
            binding.value({width, height});
          }
          width = elStyle.width;
          height = elStyle.height;
          console.log(width, height, '===')
        }
        el.__vueReize__ = setInterval(get, 16);
      },
      unmounted: function(el: any) {
        clearInterval(el.__vueReize__);
      }
    }
  },
  setup(props: any) {
    const tableState = reactive({
      start: 0,
      end: 10,
      startOffset: 0,
      screenHeight: 700,
    })
    const tableHeight = computed(() => {
      return props.dataSource.length * props.itemSize
    })
    const visibleCount = computed(() => {
      return Math.ceil(tableState.screenHeight / props.itemSize)
    })
    const visibleData = computed(() => {
      return props.dataSource.slice(tableState.start, Math.min(tableState.end, props.dataSource.length))
    })
    const getTransForm = computed(() => {
      return `translateY(${tableState.startOffset}px)`
    })
    const handleResize = (event: any) => {
      console.log(event, '----')
    }
    const scrollEvent = (event: any) => {
      let scrollTop = event.target.scrollTop
      // console.log(event, '====', scrollTop)
      tableState.start = Math.floor(scrollTop / props.itemSize)
      tableState.end = tableState.start + visibleCount.value
      tableState.startOffset = scrollTop - (scrollTop % props.itemSize)
    }
    onMounted(() => {
      tableState.end = tableState.start + visibleCount.value
    })

    return {
      tableHeight,
      visibleData,
      getTransForm,
      ...toRefs(tableState),
      handleResize,
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
.scroll-table-fixed {
  position: sticky;
  top: 0;
  z-index: 10;
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
