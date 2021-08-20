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
        <div class="more-message-div">
          <div v-if="record.isShow">
            <LogContext :contextQuery="contextQuery" :contextParams="contextParams"/>
          </div>
          <span>{{ record.message }}</span>
          <a-button class="hide-content" type="link" @click="showOrHideContent(record)" v-if="showContent">show content</a-button>
        </div>
      </template>
    </a-table>

    <a-modal v-model:visible="modalVisible" title="添加标签" width="750px" :footer="null">
      <ModalFormEdit v-if="modalVisible" :startTime="queryForm.startTime" :endTime="queryForm.endTime" @handleAddLabel="handleAddLabel" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import logCenterRepository from "@/api/logCenterRepository";
import { onMounted, reactive, UnwrapRef, toRefs, ref, watch } from "vue";
import valueRepositories from "@/composable/ValueRepositories";
import { message } from "ant-design-vue";
import { LogCenterList } from "@/utils/response";
import ModalFormEdit from "@/components/ModalFormEdit.vue";
import { flattenLogResult, timeValue } from "@/composable/commonRepositories";
import LogContext from "@/components/LogContext.vue";

export interface LabelState {
  bizLabels: string[];
  appLabels: string[];
}

export default {
  name: "LogCenter",
  components: { ModalFormEdit, LogContext },
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
    const labelValue = ref<{[key: string]: string[]}>()
    const columns = [
      { dataIndex: 'time', key: 'time', title: '时间', fixed: 'left', width: 200},
      { dataIndex: 'message', key: 'message', title: '信息', slots: { customRender: 'message', }},
      // { title: '操作', key: 'action', fixed: 'right', slots: { customRender: 'action', }, align: 'center', width: 120},
    ]
    const logList = ref<LogCenterList[]>([])
    const modalVisible = ref(false)
    const showContent = ref(false)
    const contextParams = ref()
    const contextQuery = ref()

    const addLabel = () => {
      modalVisible.value = true
    }

    const handleAddLabel = (obj: any) => {
      modalVisible.value = false
      labelValue.value = obj
      console.log('label add', obj)
    }
    const refresh = async () => {
      try {
        if (!searchForm.biz || !searchForm.app) {
          return message.warning('业务和应用不能为空')
        }
        const searchCondition = {
          biz: [searchForm.biz],
          app: [searchForm.app],
          ...labelValue.value
        }
        const query = timeValue(queryForm)
        const data = await logCenterRepository.queryLog({ searchCondition }, query)
        showContent.value = !!queryForm.searchContent
        logList.value = flattenLogResult(data.lokiRes.data.result)
        // const result = data.lokiRes.data.result.map((re: LogResultResponse) => re.values)
        // const resultFlatten = _.flatten(result)
        // logList.value = resultFlatten.map(r => ({ time: moment(parseInt(r?.[0], 10) / 1000000).format('YYYY-MM-DD HH:mm:ss'),message: r?.[1], oldTime: r?.[0], isShow: false}))
      } catch (e) {
        console.error(e)
      }
    }
    const showOrHideContent = (log: LogCenterList) => {
      log.isShow = !log.isShow
      if (log.isShow) {
        const searchCondition = {
          biz: [searchForm.biz],
          app: [searchForm.app],
          ...labelValue.value
        }
        const query: any = {
          logTime: log.oldTime
        }
        if (queryForm.limit) {
          query.limit = queryForm.limit
        }
        contextParams.value = { searchCondition }
        contextQuery.value = query
      }
    }
    const queryValues = async () => {
      const form = {
        startTime: queryForm.startTime,
        endTime: queryForm.endTime
      }
      const query = timeValue(form)
      getValues('biz', query).then(data => {
        labelState.bizLabels = data || []
      })
      getValues('app', query).then(data => {
        labelState.appLabels = data || []
      })
    }
    watch(() => [queryForm.startTime, queryForm.endTime], () => {
      queryValues()
    })
    onMounted(() => {
      queryValues()
    })

    return {
      queryForm,
      searchForm,
      logList,
      columns,
      ...toRefs(labelState),
      modalVisible,
      showContent,
      contextParams,
      contextQuery,
      addLabel,
      refresh,
      handleAddLabel,
      showOrHideContent,
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
.log-table ::v-deep .ant-table-scroll {
  overflow: inherit;
}
.log-table {
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
}
.hide-content {
  visibility: hidden;
}
.ant-table-tbody > tr {
  cursor: pointer;
}
.ant-table-tbody > tr:hover .hide-content {
  visibility: visible;
}
.more-message-div {
  position: relative;
}
</style>
