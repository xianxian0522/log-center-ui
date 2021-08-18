<template>
  <div>
    <div class="log-title-label">标签</div>
    <a-form layout="inline" :model="searchForm" class="log-form">
      <a-form-item label="业务">
        <a-select
          v-model:value="searchForm.biz"
          style="width: 200px"
          size="small"
          placeholder="请选择业务">
          <a-select-option v-for="item in bizLabels" :key="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="应用">
        <a-select
          v-model:value="searchForm.app"
          style="width: 200px"
          size="small"
          placeholder="请选择业务">
          <a-select-option v-for="item in appLabels" :key="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button @click="addLabel">添加</a-button>
      </a-form-item>
      <a-form-item>
        <a-button @click="refresh">搜索</a-button>
      </a-form-item>
    </a-form>
    <div class="log-title-label">条件</div>
    <a-form layout="inline" :model="queryForm" class="log-form">
      <a-form-item label="搜索">
        <a-input size="small" v-model:value="queryForm.searchContent" placeholder="搜索内容" />
      </a-form-item>
      <a-form-item label="限制条数">
        <a-input size="small" v-model:value="queryForm.limit" placeholder="默认1000条" />
      </a-form-item>
      <a-form-item label="开始时间">
        <a-date-picker v-model:value="queryForm.startTime" size="small" show-time placeholder="开始时间" />
      </a-form-item>
      <a-form-item label="结束时间">
        <a-date-picker v-model:value="queryForm.endTime" size="small" show-time placeholder="结束时间" />
      </a-form-item>
    </a-form>

    <a-table class="log-table" :show-header="false" :columns="columns"
             :pagination="false"
             :data-source="logList" :rowKey="record => record.time + record.message">
      <template #name="{ text }">
        <a>{{ text }}</a>
      </template>
      <template #message="{ record }">
        <span>{{ record.message }}</span>
        <a-button type="link" v-if="queryForm.searchContent">更多{{ record.time }}</a-button>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import logCenterRepository from "@/api/logCenterRepository";
import { onMounted, reactive, UnwrapRef, toRefs, ref } from "vue";
import valueRepositories from "@/composable/ValueRepositories";
import { message } from "ant-design-vue";
import moment from "moment";
import * as _ from "lodash";
import { LogCenterList, LogResultResponse } from "@/utils/response";

export interface LabelState {
  bizLabels: string[];
  appLabels: string[];
}

export default {
  name: "LogCenter",
  setup() {
    const { getValues } = valueRepositories()
    const labelState: UnwrapRef<LabelState> = reactive({
      bizLabels: [],
      appLabels: [],
    })
    const searchForm = reactive({
      biz: undefined,
      app: undefined,
    })
    const queryForm = reactive({
      searchContent: undefined,
      limit: undefined,
      startTime: null,
      endTime: null,
    })
    const columns = [
      { dataIndex: 'time', key: 'time', title: '时间', fixed: 'left', width: 200},
      { dataIndex: 'message', key: 'message', title: '信息', slots: { customRender: 'message', }},
      // { title: '操作', key: 'action', fixed: 'right', slots: { customRender: 'action', }, align: 'center', width: 120},
    ]
    const logList = ref<LogCenterList[]>([])

    const addLabel = () => {
      console.log('add')
    }
    const refresh = async () => {
      try {
        if (!searchForm.biz || !searchForm.app) {
          return message.warning('业务和应用不能为空')
        }
        const searchCondition = {
          biz: [searchForm.biz],
          app: [searchForm.app],
        }
        const query: any = {...queryForm}
        if (queryForm.startTime) {
          query.startTime = moment(queryForm.startTime).valueOf()
        }
        if (queryForm.endTime) {
          query.endTime = moment(queryForm.endTime).valueOf()
        }
        const data = await logCenterRepository.queryLog({ searchCondition }, query)
        const result = data.lokiRes.data.result.map((re: LogResultResponse) => re.values)
        const resultFlatten = _.flatten(result)
        logList.value = resultFlatten.map(r => ({time: moment(parseInt(r?.[0], 10) / 1000000).format('YYYY-MM-DD HH:mm:ss'), message: r?.[1]}))
      } catch (e) {
        console.error(e)
      }
    }

    onMounted(() => {
      getValues('biz').then(data => {
        labelState.bizLabels = data || []
      })
      getValues('app').then(data => {
        labelState.appLabels = data || []
      })
    })

    return {
      queryForm,
      searchForm,
      logList,
      columns,
      ...toRefs(labelState),
      addLabel,
      refresh,
    }
  }
};
</script>

<style scoped lang="less">
.log-title-label {
  font-size: 16px;
  font-weight: 700;
}
.log-form {
  margin-bottom: 10px;
}
.log-table ::v-deep .ant-table-thead > tr > th, .log-table ::v-deep .ant-table-tbody > tr > td {
  white-space: pre-wrap;
  word-break: break-all;
}
.log-table {
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
}
</style>
