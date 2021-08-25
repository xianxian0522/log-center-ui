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
    <a-dropdown>
      <a class="ant-dropdown-link" @click.prevent>
        <a-button>
          <ClockCircleOutlined />
          <DownOutlined />
          <div>111</div>
        </a-button>
      </a>
      <template #overlay>
        <div class="dropdown-time">
          <div>2021-08-25 09:05:06</div>
          <div>to</div>
          <div>2021-08-25 10:30:26</div>
        </div>
      </template>
    </a-dropdown>
    <a-spin :spinning="spinning">
      <CommonTable :columns="columns" :data-source="logList" ></CommonTable>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import logCenterRepository from "@/api/logCenterRepository";
import { flattenLogResult, timeValue } from "@/composable/commonRepositories";
import { LogCenterList } from "@/utils/response";
import CommonTable from "@/components/CommonTable.vue";
import {ClockCircleOutlined, DownOutlined, } from '@ant-design/icons-vue'

export default {
  name: "LogSearch",
  components: { CommonTable, ClockCircleOutlined, DownOutlined },
  setup() {
    const queryForm = reactive({
      searchContent: undefined,
      limit: undefined,
      startTime: null,
      endTime: null,
    })
    const columns = [
      { dataIndex: 'time', key: 'time', title: '时间', fixed: 'left', width: 200},
      { dataIndex: 'message', key: 'message', title: '信息', },
    ]
    const logList = ref<LogCenterList[]>([])
    const spinning = ref(false)

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
    onMounted(() => {
      // searchLog()
    })

    return {
      columns,
      logList,
      spinning,
      queryForm,
      searchLog,
    }
  }
};
</script>

<style scoped lang="less">
.log-search {
  margin-bottom: 10px;
}
.dropdown-time {
  background: #fff;
  padding: 5px;
  text-align: center;
  font-size: 12px;
  margin-top: 5px;
}
</style>
