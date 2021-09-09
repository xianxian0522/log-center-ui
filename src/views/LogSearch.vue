<template>
  <div>
    <a-form layout="inline" :model="queryForm" class="log-search">
      <a-form-item label="时间">
        <CommonTimeRange @changeQueryTime="changeQueryTime" />
      </a-form-item>
      <a-form-item label="限制条数">
        <a-input @pressEnter="searchLog" size="small" v-model:value="queryForm.limit" placeholder="默认1000条" />
      </a-form-item>
    </a-form>
    <a-form :model="queryForm">
      <a-form-item label="LogQL">
        <a-textarea @pressEnter="searchLog" v-model:value="queryForm.searchContent" placeholder="input LogQL, Enter" :rows="4" />
      </a-form-item>
    </a-form>

    <a-spin :spinning="spinning" >
      <ScrollTable ref="scrollTableRef" :data-source="logList" @lastPageLog="lastPageLog" @nextPageLog="nextPageLog" />
    </a-spin>
  </div>
</template>

<script lang="ts">
import { reactive, ref, UnwrapRef } from "vue";
import logCenterRepository from "@/api/logCenterRepository";
import { flattenLogResult, timeValue } from "@/composable/commonRepositories";
import { LogCenterList, QueryForm } from "@/utils/response";
import moment, { Moment } from "moment";
import CommonTimeRange from "@/components/CommonTimeRange.vue";
import ScrollTable from "@/components/ScrollTable.vue";

export default {
  name: "LogSearch",
  components: {
    CommonTimeRange,
    ScrollTable,
  },
  setup() {
    const queryForm: UnwrapRef<QueryForm> = reactive({
      searchContent: undefined,
      limit: undefined,
      startTime: undefined,
      endTime: undefined,
      lastPageStartTime: undefined,
      nextPageStartTime: undefined,
    })
    const columns = [
      { dataIndex: 'time', key: 'time', title: '时间', fixed: 'left', width: 200},
      { dataIndex: 'message', key: 'message', title: '信息', },
    ]
    const logList = ref<LogCenterList[]>([])
    const spinning = ref(false)
    const scrollTableRef = ref()

    const searchLog = async () => {
      try {
        spinning.value = true
        const query = timeValue(queryForm)
        const data = await logCenterRepository.searchLog(query)
        logList.value = flattenLogResult(data.lokiRes.data.result)
        scrollTableRef.value?.changePageInfo(data)
        spinning.value = false
      } catch (e) {
        spinning.value = false
        console.error(e)
      }
    }
    const changeQueryTime = (obj: any) => {
      queryForm.startTime = obj?.startTime
      queryForm.endTime = obj?.endTime
      searchLog()
    }
    const lastPageLog = (lastTime: string) => {
      queryForm.lastPageStartTime = lastTime
      queryForm.nextPageStartTime = undefined
      searchLog()
    }
    const nextPageLog = (nextTime: string) => {
      queryForm.nextPageStartTime = nextTime
      queryForm.lastPageStartTime = undefined
      searchLog()
    }

    return {
      columns,
      logList,
      spinning,
      queryForm,
      scrollTableRef,
      searchLog,
      changeQueryTime,
      lastPageLog,
      nextPageLog,
    }
  }
};
</script>

<style scoped lang="less">
.log-search {
  margin-bottom: 10px;
}
</style>
