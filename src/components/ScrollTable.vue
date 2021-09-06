<template>
  <div @scroll="scrollEvent" :style="{height: screenHeight}">
    <div ></div>
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
      console.log(event, '====')
    }
    onMounted(() => {
      tableState.end = tableState.start + visibleCount.value
    })

    return {
      tableHeight,
      visibleData,
      ...toRefs(tableState),
      handleResize,
      scrollEvent,
    }
  }
};
</script>

<style scoped lang="less">

</style>
