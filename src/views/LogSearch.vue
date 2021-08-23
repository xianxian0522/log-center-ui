<template>
  <div>
    <a-form layout="inline" :model="queryForm" class="log-search">
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
    <a-form :model="queryForm" class="log-search">
      <a-form-item label="LogQL">
        <a-textarea v-model:value="queryForm.searchContent" placeholder="input LogQL" :rows="4" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive } from "vue";
import logCenterRepository from "@/api/logCenterRepository";
import { timeValue } from "@/composable/commonRepositories";

export default {
  name: "LogSearch",
  setup() {
    const queryForm = reactive({
      searchContent: undefined,
      limit: undefined,
      startTime: null,
      endTime: null,
    })

    const searchLog = async () => {
      const query = timeValue(queryForm)
      console.log('====', query)
      await logCenterRepository.searchLog(query)
    }
    onMounted(() => {
      searchLog()
    })

    return {
      queryForm,
    }
  }
};
</script>

<style scoped lang="less">
.log-search {
  margin-bottom: 10px;
}
</style>
