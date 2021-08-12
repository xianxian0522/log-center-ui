<template>
  <div>
    <div class="log-title-label">标签</div>
    <a-form layout="inline" :model="searchForm" >
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

    onMounted(() => {
      getValues('biz').then(data => {
        labelState.bizLabels = data || []
      })
      getValues('app').then(data => {
        labelState.appLabels = data || []
      })
    })

    return {
      searchForm,
      ...toRefs(labelState),
      addLabel,
    }
  }
};
</script>

<style scoped lang="less">
.log-title-label {
  font-size: 16px;
  font-weight: 700;
}
</style>
