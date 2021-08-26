<template>
  <div>
    <a-dropdown :trigger="['click']" v-model:visible="rangeVisible" @click.stop="rangeVisible = !rangeVisible">
      <a-tooltip placement="bottom">
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
      <template #overlay >
        <CommonDropdown v-if="rangeVisible" @changeTimeRange="changeTimeRange" @changeTimeSelect="changeTimeSelect" :is-range="isRange" :form-time="{ startTime, endTime }"/>
      </template>
    </a-dropdown>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref, toRefs, watch } from "vue";
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
  setup() {
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
    }

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
</style>
