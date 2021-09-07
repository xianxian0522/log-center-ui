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
          placeholder="请选择应用">
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
    <div class="log-title-label">添加的标签</div>
    <div class="log-add-label">
      <div v-if="labelValueList?.length === 0">
        <a-empty :description="'暂无添加的标签'" :image="simpleImage" />
      </div>
      <a-descriptions v-else bordered>
        <a-descriptions-item v-for="item in labelValueList" :key="item.label" :label="item.label">
          <a-tag color="processing" v-for="value in item.value" :key="value">{{ value }}</a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="log-title-label">条件</div>
    <a-form layout="inline" :model="queryForm" class="log-form">
      <a-form-item label="时间">
        <CommonTimeRange @changeQueryTime="changeQueryTime" />
      </a-form-item>
      <a-form-item label="搜索">
        <a-input size="small" v-model:value="queryForm.searchContent" placeholder="搜索内容" />
      </a-form-item>
      <a-form-item label="限制条数">
        <a-input size="small" v-model:value="queryForm.limit" placeholder="默认500条" />
      </a-form-item>
    </a-form>

    <a-spin :spinning="spinning" style="height: 132px;">
      <ScrollTable :data-source="logList" :is-show-context="true">
        <template v-slot:default="{ logContext }">
          <div class="more-message-div">
            <div v-if="logContext.isShow">
              <LogContext :contextQuery="contextQuery" :contextParams="contextParams"/>
            </div>
            <span>{{ logContext.message }}</span>
            <a-button class="hide-content" type="link" @click="showOrHideContent(logContext)" v-if="showContent">{{ logContext.isShow ? 'hide' : 'show' }} content</a-button>
          </div>
        </template>
      </ScrollTable>
<!--      <a-table class="log-table" :show-header="false" :columns="columns"-->
<!--               :pagination="false"-->
<!--               :data-source="logList" :rowKey="record => record.oldTime + record.message">-->
<!--        <template #name="{ text }">-->
<!--          <a>{{ text }}</a>-->
<!--        </template>-->
<!--        <template #message="{ record }">-->
<!--          <div class="more-message-div">-->
<!--            <div v-if="record.isShow">-->
<!--              <LogContext :contextQuery="contextQuery" :contextParams="contextParams"/>-->
<!--            </div>-->
<!--            <span>{{ record.message }}</span>-->
<!--            <a-button class="hide-content" type="link" @click="showOrHideContent(record)" v-if="showContent">{{ record.isShow ? 'hide' : 'show' }} content</a-button>-->
<!--          </div>-->
<!--        </template>-->
<!--      </a-table>-->
    </a-spin>

    <a-modal v-model:visible="modalVisible" title="添加标签" width="750px" :footer="null">
      <ModalFormEdit v-if="modalVisible" :startTime="queryForm.startTime" :endTime="queryForm.endTime" @handleAddLabel="handleAddLabel" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import logCenterRepository from "@/api/logCenterRepository";
import { onMounted, reactive, UnwrapRef, toRefs, ref, watch } from "vue";
import valueRepositories from "@/composable/ValueRepositories";
import { Empty, message } from "ant-design-vue";
import { LabelValue, LogCenterList } from "@/utils/response";
import ModalFormEdit from "@/components/ModalFormEdit.vue";
import { flattenLogResult, timeValue } from "@/composable/commonRepositories";
import LogContext from "@/components/LogContext.vue";
import CommonTimeRange from "@/components/CommonTimeRange.vue";
import ScrollTable from "@/components/ScrollTable.vue";

export interface LabelState {
  bizLabels: string[];
  appLabels: string[];
  labelValueList: LabelValue[]
}

export default {
  name: "LogCenter",
  components: { ModalFormEdit, LogContext, CommonTimeRange, ScrollTable },
  setup() {
    const { getValues } = valueRepositories()
    const labelState: UnwrapRef<LabelState> = reactive({
      bizLabels: [],
      appLabels: [],
      labelValueList: [],
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
    const spinning = ref(false)
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
      labelValue.value = obj?.[0]
      labelState.labelValueList = obj?.[1]
      labelState.labelValueList.pop()
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
        spinning.value = true
        const query = timeValue(queryForm)
        const data = await logCenterRepository.queryLog({ searchCondition }, query)
        showContent.value = !!queryForm.searchContent
        spinning.value = false
        logList.value = flattenLogResult(data.lokiRes.data.result)
        // const result = data.lokiRes.data.result.map((re: LogResultResponse) => re.values)
        // const resultFlatten = _.flatten(result)
        // logList.value = resultFlatten.map(r => ({ time: moment(parseInt(r?.[0], 10) / 1000000).format('YYYY-MM-DD HH:mm:ss'),message: r?.[1], oldTime: r?.[0], isShow: false}))
      } catch (e) {
        spinning.value = false
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
    const changeQueryTime = (obj: any) => {
      queryForm.startTime = obj?.startTime
      queryForm.endTime = obj?.endTime
      queryValues()
    }

    return {
      queryForm,
      searchForm,
      logList,
      spinning,
      columns,
      ...toRefs(labelState),
      modalVisible,
      showContent,
      contextParams,
      contextQuery,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      addLabel,
      refresh,
      handleAddLabel,
      showOrHideContent,
      changeQueryTime,
    }
  }
};
</script>

<style scoped lang="less">
.log-title-label {
  font-size: 16px;
  font-weight: 700;
}
.log-form, .log-add-label {
  margin-bottom: 20px;
}
//.log-table ::v-deep .ant-table-thead > tr > th, .log-table ::v-deep .ant-table-tbody > tr > td {
//  white-space: pre-wrap;
//  word-break: break-all;
//}
//.log-table ::v-deep .ant-table-scroll {
//  overflow: inherit;
//}
//.log-table {
//  font-family: "Roboto Mono", monospace;
//  font-size: 12px;
//}
.hide-content {
  visibility: hidden;
}
.scroll-tbody > tr {
  cursor: pointer;
}
.scroll-tbody > tr:hover .hide-content {
  visibility: visible;
}
.more-message-div {
  position: relative;
}
.log-add-label ::v-deep .ant-descriptions {
  margin-top: 5px;
}
</style>
