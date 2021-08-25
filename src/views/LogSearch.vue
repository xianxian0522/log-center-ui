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
    <a-dropdown :trigger="['click']">
      <a-tooltip placement="bottom">
        <template #title>
          <div class="dropdown-time-title">
            <div>2021-08-25 09:05:06</div>
            <div>to</div>
            <div>2021-08-25 10:30:26</div>
          </div>
        </template>
        <a class="ant-dropdown-link" @click.prevent>
          <a-button>
            <ClockCircleOutlined />
            <DownOutlined />
          </a-button>
        </a>
      </a-tooltip>
      <template #overlay>
        <div class="dropdown-time-show">
          <div class="time-show-content">
            <div class="time-show-time" @click.stop.prevent>
              <a-form :model="queryForm" layout="vertical">
                <a-form-item label="form">
                  <a-date-picker style="width: 100%;" v-model:value="queryForm.startTime" size="small" show-time placeholder="开始时间" />
                </a-form-item>
                <a-form-item label="to">
                  <a-date-picker style="width: 100%;" v-model:value="queryForm.endTime" size="small" show-time placeholder="结束时间" />
                </a-form-item>
              </a-form>
            </div>
            <div></div>
          </div>
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
.dropdown-time-title {
  text-align: center;
  font-size: 12px;
  margin-top: 5px;
}
.dropdown-time-show {
  background: #ccc;
  box-shadow: #ccc 0 10px 20px;
  width: 546px;
  border-radius: 5px;
  border: 1px solid rgba(204, 204, 204, 0.07);
  margin-top: 10px;
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
    }
  }
}
.ant-form-vertical .ant-form-item {
  margin-bottom: 10px;
}
</style>
