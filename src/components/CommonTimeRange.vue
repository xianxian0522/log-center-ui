<template>
  <div class="common-time-range">
    <a-tooltip placement="bottom" @click.stop="rangeClick">
      <template #title>
        <div class="dropdown-time-title">
          <div>{{ changeTimeFormat(startTime) }}</div>
          <div>to</div>
          <div>{{ changeTimeFormat(endTime) }}</div>
        </div>
      </template>
      <a class="ant-dropdown-link">
        <a-button>
          <ClockCircleOutlined />
          <DownOutlined />
        </a-button>
      </a>
    </a-tooltip>
    <CommonDropdown class="common-dropdown" v-if="rangeVisible" @changeTimeRange="changeTimeRange" @changeTimeSelect="changeTimeSelect" :is-range="isRange" :form-time="{ startTime, endTime }"/>
  </div>
</template>

<script lang="ts">
import { onMounted, provide, reactive, ref, toRefs, watch } from "vue";
import moment, { Moment } from "moment";
import { ClockCircleOutlined, DownOutlined } from "@ant-design/icons-vue";
import CommonDropdown from "@/components/CommonDropdown.vue";

export interface TimeRange {
  value: string;
  second: number;
  num: string;
  select: boolean;
}

export default {
  name: "CommonTimeRange",
  components: {
    ClockCircleOutlined, DownOutlined,
    CommonDropdown,
  },
  emits: ['changeQueryTime'],
  setup(props: any, {emit}: any) {
    const startTime = ref<Moment>()
    const endTime = ref<Moment>()
    const rangeState = reactive({
      rangeVisible: false,
      isRange: true,
    })

    const changeTimeFormat = (time: any) => {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
    const changeTimeSelect = (obj: any) => {
      changeState(obj)
      rangeState.isRange = false
    }
    const changeTimeRange = (obj: any) => {
      changeState(obj)
      rangeState.isRange = true
    }
    const changeState = (obj: any) => {
      startTime.value = obj.startTime
      endTime.value = obj.endTime
      rangeState.rangeVisible = false
      emit('changeQueryTime', obj)
    }
    const rangeClick = () => {
      try {
        rangeState.rangeVisible = !rangeState.rangeVisible
      } catch (e) {
        console.error(e)
      }
    }
    provide('rangeVisibleChange', rangeClick)

    onMounted(() => {
      const date = moment()
      endTime.value = date
      startTime.value = moment(date.valueOf() - 30 * 60 * 1000)
    })

    return {
      endTime,
      startTime,
      ...toRefs(rangeState),
      changeTimeFormat,
      changeTimeSelect,
      changeTimeRange,
      rangeClick,
    }
  }
};
</script>

<style scoped lang="less">
.dropdown-time-title {
  text-align: center;
  font-size: 12px;
  margin-top: 5px;
}
.common-time-range {
  position: relative;
  .common-dropdown {
    position: absolute;
    z-index: 10;
  }
}
</style>
