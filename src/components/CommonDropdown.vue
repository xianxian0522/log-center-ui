<template>
  <div class="dropdown-time-show">
    <div class="time-show-content">
      <div class="time-show-time" >
        <div @click.stop>
          <div class="time-select-range-absolute"><span class="time-select-title-span">Absolute time range</span></div>
          <div class="show-time-date">
            <div>To</div>
            <a-date-picker style="width: 100%;" v-model:value="startTime" size="small"
                           :disabled-date="disabledStartDate"
                           @change="showStartTimeChange"
                           @openChange="handleStartOpenChange"
                           show-time placeholder="开始时间" >
              <span class="show-time-date-span">{{ startTime ? showStartTime : '选择开始时间' }}</span>
            </a-date-picker>
          </div>
          <div class="show-time-date">
            <div>Form</div>
            <a-date-picker style="width: 100%;" v-model:value="endTime" size="small"
                           :disabled-date="disabledEndDate"
                           :open="endOpen"
                           @change="showEndTimeChange"
                           @openChange="handleEndOpenChange"
                           show-time placeholder="结束时间" >
              <span class="show-time-date-span">{{ endTime ? showEndTime : '选择结束时间' }}</span>
            </a-date-picker>
          </div>
        </div>
        <a-button @click="changeTimeSelect" type="primary">Apply time range</a-button>
      </div>
      <div class="time-select">
        <div class="time-select-title"><span class="time-select-title-span">Relative time ranges</span></div>
        <div class="time-select-title time-select-range" :class="{active: time.select}" v-for="time in timeSelectRanges" :key="time.value" @click="selectRangeTime(time)">
          <span>{{ time.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref, toRefs } from "vue";
import moment, { Moment } from "moment";

export interface TimeRange {
  value: string;
  second: number;
  num: string;
  select: boolean;
}

export default {
  name: "CommonDropdown",
  props: {
    formTime: Object,
    isRange: Boolean,
  },
  emits: ['changeTimeSelect', 'changeTimeRange'],
  setup(props: any, {emit}: any) {
    const timeSelectRanges = ref<TimeRange[]>([
      { value: 'Last 5 minutes', second: 5 * 60 * 1000, num: '5m', select: false },
      { value: 'Last 15 minutes', second: 15 * 60 * 1000, num: '15m', select: false },
      { value: 'Last 30 minutes', second: 30 * 60 * 1000, num: '30m', select: false },
      { value: 'Last 1 hour', second: 60 * 60 * 1000, num: '1h', select: false },
      { value: 'Last 3 hour', second: 3 * 60 * 60 * 1000, num: '3h', select: false },
      { value: 'Last 6 hour', second: 6 * 60 * 60 * 1000, num: '6h', select: false },
      { value: 'Last 12 hour', second: 12 * 60 * 60 * 1000, num: '12h', select: false },
      { value: 'Last 24 hour', second: 24 * 60 * 60 * 1000, num: '24h', select: false },
      { value: 'Last 2 days', second: 2 * 24 * 60 * 60 * 1000, num: '2d', select: false },
      { value: 'Last 7 days', second: 7 * 24 * 60 * 60 * 1000, num: '7d', select: false },
      { value: 'Last 30 days', second: 30 * 24 * 60 * 60 * 1000, num: '30d', select: false },
      { value: 'Last 90 days', second: 90 * 24 * 60 * 60 * 1000, num: '90d', select: false },
    ])
    const showTime = reactive({
      showStartTime: '',
      showEndTime: '',
      endOpen: false,
    })
    const startTime = ref<Moment>()
    const endTime = ref<Moment>()
    console.log('-=-==', props.formTime, props.isRange)

    const getTime = () => {
      return  {
        startTime: startTime.value,
        endTime: endTime.value
      }
    }
    const changeTimeSelect = () => {
      try {
        emit('changeTimeSelect', getTime())
      } catch (e) {
        console.error(e)
      }
    }
    const changeQueryTime = (second: number) => {
      const date = moment()
      endTime.value = date
      startTime.value = moment(date.valueOf() - second)
    }
    const showStartTimeChange = (time: Moment) => {
      showTime.showStartTime = time.format('YYYY-MM-DD HH:mm:ss')
    }
    const showEndTimeChange = (time: Moment) => {
      showTime.showEndTime = time.format('YYYY-MM-DD HH:mm:ss')
    }
    const changeTimeFormat = (time: any) => {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
    const selectRangeTime = (time: TimeRange, noEmit?: boolean) => {
      timeSelectRanges.value.forEach((item: TimeRange) => item.select = false)
      time.select = !time.select
      changeQueryTime(time.second)
      showTime.showStartTime = 'now-' + time.num
      showTime.showEndTime = 'now'

      if (!noEmit) {
        emit('changeTimeRange', getTime())
      }
    }
    const disabledStartDate = (startValue: Moment) => {
      if (!startValue || !endTime.value) {
        return false;
      }
      return startValue.valueOf() > endTime.value.valueOf()
    }
    const disabledEndDate = (endValue: Moment) => {
      if (!endValue || !startTime.value) {
        return false;
      }
      return startTime.value.valueOf() >= endValue.valueOf()
    }
    const handleStartOpenChange = (open: boolean) => {
      if (!open) {
        showTime.endOpen = true
      }
    }
    const handleEndOpenChange = (open: boolean) => {
      showTime.endOpen = open
    }
    onMounted(() => {
      if (props.isRange) {
        const second = moment(props.formTime?.endTime).valueOf() - moment(props.formTime?.startTime).valueOf()
        const item = timeSelectRanges.value.filter((t: TimeRange) => t.second === second)?.[0]
        selectRangeTime(item, true)
      } else {
        endTime.value = props.formTime?.endTime
        showEndTimeChange(endTime.value!)
        startTime.value = props.formTime?.startTime
        showStartTimeChange(startTime.value!)
      }
    })

    return {
      endTime,
      startTime,
      timeSelectRanges,
      ...toRefs(showTime),
      selectRangeTime,
      changeTimeFormat,
      showStartTimeChange,
      showEndTimeChange,
      disabledStartDate,
      disabledEndDate,
      handleEndOpenChange,
      handleStartOpenChange,
      changeTimeSelect,
    }
  }
};
</script>

<style scoped lang="less">
.dropdown-time-show {
  background: #ccc;
  box-shadow: #ccc 0 10px 20px;
  width: 546px;
  border-radius: 5px;
  border: 1px solid rgba(204, 204, 204, 0.07);
  margin-top: 10px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;

  .time-show-content {
    height: 381px;
    display: flex;
    .time-show-time {
      display: flex;
      flex-direction: column;
      width: 60%;
      overflow: hidden;
      order: 0;
      padding-right: 20%;
      padding-left: 11px;
      padding-top: 9px;
      border-right: 1px solid #ddd;

      .ant-btn-primary {
        border-radius: 4px;
      }
    }
  }
  .time-select {
    overflow: scroll;
    flex: 1;
    .time-select-title {
      padding: 7px 9px;
    }
    .time-select-range {
      cursor: pointer;
    }
    .time-select-range:hover {
      background: #bfbfbfb3;
    }
  }
}
.time-select-title-span {
  font-size: 14px;
  font-weight: 600;
}
.time-select-range-absolute {
  margin-bottom: 11px;
}
.active {
  background: #bfbfbf;
}
.show-time-date {
  margin-bottom: 16px;
  div {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .show-time-date-span {
    display: inline-block;
    width: 100%;
    border: 1px solid #ddd;
    padding: 0 8px;
  }
}
</style>
