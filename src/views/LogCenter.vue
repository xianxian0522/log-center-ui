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
  </div>
</template>

<script lang="ts">
import logCenterRepository from "@/api/logCenterRepository";
import { onMounted, reactive, UnwrapRef, toRefs } from "vue";
import valueRepositories from "@/composable/ValueRepositories";

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
      biz: [],
      app: [],
    })
    const queryForm = reactive({
      searchContent: '',
      limit: '',
      startTime: '',
      endTime: '',
    })

    const querySearchLog = async () => {
      try {
        const params = {}
        const query = {limit: 100, searchContent: 'xxx'}
        await logCenterRepository.queryLog(params, query)
      } catch (e) {
        console.error(e)
      }
    }
    const addLabel = () => {
      const value = {
        biz: [searchForm.biz],
        app: [searchForm.app]
      }
      console.log(value)
    }
    const refresh = async () => {
      console.log('refresh')
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
</style>
