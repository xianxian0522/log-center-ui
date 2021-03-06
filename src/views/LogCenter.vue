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
        <a-button @click="searchQueryChange">搜索</a-button>
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
        <a-input size="small" @pressEnter="searchQueryChange" v-model:value="queryForm.searchContent" placeholder="搜索内容" />
      </a-form-item>
      <a-form-item label="限制条数">
        <a-input size="small" @pressEnter="searchQueryChange" v-model:value="queryForm.limit" placeholder="默认1000条" />
      </a-form-item>
    </a-form>

    <a-spin :spinning="spinning" >
      <ScrollTable :data-source="logList" :is-show-context="true" ref="scrollTableRef" @lastPageLog="lastPageLog" @nextPageLog="nextPageLog">
        <template v-slot:default="{ logContext }">
          <div class="more-message-div">
            <div v-if="logContext.isShow">
              <LogContext :contextQuery="contextQuery" :contextParams="contextParams"/>
            </div>
            <span v-html="logContext.message"></span>
            <a-button class="hide-content" type="link" @click="showOrHideContent(logContext)" v-if="showContent">{{ logContext.isShow ? 'hide' : 'show' }} content</a-button>
          </div>
        </template>
      </ScrollTable>
    </a-spin>

    <a-modal v-model:visible="modalVisible" title="添加标签" width="750px" :footer="null">
      <ModalFormEdit v-if="modalVisible" :startTime="queryForm.startTime" :endTime="queryForm.endTime" @handleAddLabel="handleAddLabel" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import logCenterRepository from "@/api/logCenterRepository";
import { reactive, UnwrapRef, toRefs, ref, } from "vue";
import valueRepositories from "@/composable/ValueRepositories";
import { Empty, message } from "ant-design-vue";
import { LabelValue, LogCenterList, QueryForm } from "@/utils/response";
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
  components: {
    ModalFormEdit, CommonTimeRange,
    LogContext, ScrollTable
  },
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
    const queryForm: UnwrapRef<QueryForm> = reactive({
      searchContent: undefined,
      limit: undefined,
      startTime: undefined,
      endTime: undefined,
      lastPageStartTime: undefined,
      nextPageStartTime: undefined,
    })
    const labelValue = ref<{[key: string]: string[]}>()

    const spinning = ref(false)
    const logList = ref<LogCenterList[]>([])
    const modalVisible = ref(false)
    const showContent = ref(false)
    const contextParams = ref()
    const contextQuery = ref()
    const scrollTableRef = ref()

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
        if (queryForm.searchContent) {
          messageReplace()
        }
        scrollTableRef.value?.changePageInfo(data)
      } catch (e) {
        spinning.value = false
        console.error(e)
      }
    }
    const messageReplace = () => {
      logList.value.forEach((item: LogCenterList) => {
        item.message = item.message.replace(new RegExp(queryForm.searchContent!, 'g'), `<span style="color: #ecbb13;font-weight: bold;">${queryForm.searchContent}</span>` )
      })
    }
    const searchQueryChange = () => {
      queryForm.lastPageStartTime = undefined
      queryForm.nextPageStartTime = undefined
      refresh()
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
      if (searchForm.biz && searchForm.app) {
        searchQueryChange()
      }
    }
    const lastPageLog = (lastTime: string) => {
      queryForm.lastPageStartTime = lastTime
      queryForm.nextPageStartTime = undefined
      refresh()
    }
    const nextPageLog = (nextTime: string) => {
      queryForm.nextPageStartTime = nextTime
      queryForm.lastPageStartTime = undefined
      refresh()
    }

    return {
      queryForm,
      searchForm,
      logList,
      spinning,
      ...toRefs(labelState),
      modalVisible,
      showContent,
      contextParams,
      contextQuery,
      scrollTableRef,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      addLabel,
      searchQueryChange,
      handleAddLabel,
      showOrHideContent,
      changeQueryTime,
      lastPageLog,
      nextPageLog,
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
