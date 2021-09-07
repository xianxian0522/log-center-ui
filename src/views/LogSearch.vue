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

    <a-spin :spinning="spinning" style="height: inherit">
<!--      <CommonTable :columns="columns" :data-source="logList" ></CommonTable>-->
      <ScrollTable :data-source="logList" />
    </a-spin>
  </div>
</template>

<script lang="ts">
import { reactive, ref, UnwrapRef } from "vue";
import logCenterRepository from "@/api/logCenterRepository";
import { flattenLogResult, timeValue } from "@/composable/commonRepositories";
import { LogCenterList } from "@/utils/response";
import CommonTable from "@/components/CommonTable.vue";
import moment, { Moment } from "moment";
import CommonTimeRange from "@/components/CommonTimeRange.vue";
import ScrollTable from "@/components/ScrollTable.vue";

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
    // CommonTable,
    ScrollTable,
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

    // for (let index = 0; index < 500; index++) {
    //   logList.value.push({
    //     index: index,
    //     time: moment() + '',
    //     message: 'message' + index,
    //     oldTime: moment().valueOf() + index + '',
    //     isShow: true,
    //   })
    // }

    const searchLog = async () => {
      try {
        spinning.value = true
        const query = timeValue(queryForm)
        const data = await logCenterRepository.searchLog(query)
        logList.value = flattenLogResult(data.lokiRes.data.result)
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

    return {
      columns,
      logList,
      spinning,
      queryForm,
      searchLog,
      changeQueryTime,
    }
  }
};
</script>

<style scoped lang="less">
.log-search {
  margin-bottom: 10px;
}
</style>
