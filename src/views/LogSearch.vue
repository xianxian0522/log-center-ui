<template>
  <div>
    <a-form layout="inline" :model="queryForm" class="log-search">
      <a-form-item label="限制条数">
        <a-input @pressEnter="searchLog" size="small" v-model:value="queryForm.limit" placeholder="默认1000条" />
      </a-form-item>
      <a-form-item label="开始时间">
        <a-date-picker @change="searchLog" v-model:value="queryForm.startTime" size="small" show-time placeholder="开始时间" />
      </a-form-item>
      <a-form-item label="结束时间">
        <a-date-picker @change="searchLog" v-model:value="queryForm.endTime" size="small" show-time placeholder="结束时间" />
      </a-form-item>
    </a-form>
    <a-form :model="queryForm">
      <a-form-item label="LogQL">
        <a-textarea @pressEnter="searchLog" v-model:value="queryForm.searchContent" placeholder="input LogQL" :rows="4" />
      </a-form-item>
    </a-form>

    <CommonTimeRange />
<!--    <a-dropdown :trigger="['click']" v-model:visible="rangeVisible">-->
<!--      <a-tooltip placement="bottom">-->
<!--        <template #title>-->
<!--          <div class="dropdown-time-title">-->
<!--            <div>{{ changeTimeFormat(queryForm.startTime) }}</div>-->
<!--            <div>to</div>-->
<!--            <div>{{ changeTimeFormat(queryForm.endTime) }}</div>-->
<!--          </div>-->
<!--        </template>-->
<!--        <a class="ant-dropdown-link">-->
<!--          <a-button>-->
<!--            <ClockCircleOutlined />-->
<!--            <DownOutlined />-->
<!--          </a-button>-->
<!--        </a>-->
<!--      </a-tooltip>-->
<!--      <template #overlay>-->
<!--        <CommonTimeRange v-if="rangeVisible" :is-range="isRange" :form-time="queryForm" />-->
<!--      </template>-->
<!--    </a-dropdown>-->
    <a-spin :spinning="spinning">
      <CommonTable :columns="columns" :data-source="logList" ></CommonTable>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { reactive, ref, UnwrapRef } from "vue";
import logCenterRepository from "@/api/logCenterRepository";
import { flattenLogResult, timeValue } from "@/composable/commonRepositories";
import { LogCenterList } from "@/utils/response";
import CommonTable from "@/components/CommonTable.vue";
import { Moment } from "moment";
import CommonTimeRange from "@/components/CommonTimeRange.vue";

export interface QueryForm {
  searchContent?: string,
  limit?: string,
  startTime?: Moment,
  endTime?: Moment,
}

export default {
  name: "LogSearch",
  components: {
    CommonTimeRange,
    CommonTable,
    // ClockCircleOutlined, DownOutlined,
  },
  setup() {
    const queryForm: UnwrapRef<QueryForm> = reactive({
      searchContent: undefined,
      limit: undefined,
      startTime: undefined,
      endTime: undefined,
    })
    const columns = [
      { dataIndex: 'time', key: 'time', title: '时间', fixed: 'left', width: 200},
      { dataIndex: 'message', key: 'message', title: '信息', },
    ]
    const logList = ref<LogCenterList[]>([])
    const spinning = ref(false)
    // const rangeVisible = ref(false)
    // const isRange = ref(true)

    const searchLog = async () => {
      try {
        spinning.value = true
        const query = timeValue(queryForm)
        const data = await logCenterRepository.searchLog(query)
        logList.value = flattenLogResult(data.data.result)
        spinning.value = false
      } catch (e) {
        spinning.value = false
        console.error(e)
      }
    }

    return {
      columns,
      logList,
      spinning,
      queryForm,
      // rangeVisible,
      // isRange,
      searchLog,
    }
  }
};
</script>

<style scoped lang="less">
.log-search {
  margin-bottom: 10px;
}
</style>
