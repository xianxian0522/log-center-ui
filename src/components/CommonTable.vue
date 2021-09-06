<template>
  <div >
    <a-table class="common-table" :columns="columns" :data-source="dataSource" :rowKey="record => record.id + JSON.stringify(record)"
             @change="paginationChange"
             :scroll="{x: scrollX}"
             :pagination="isPagination ? pagination : false">
      <template #name="{ text }">
        <a>{{ text }}</a>
      </template>
      <template #time="{ text }">
        <span>{{ timeFormat(text) }}</span>
      </template>
      <template #tags="{ text }">
        <span>
          <a-tag v-for="tag in text" :key="tag" color="processing">{{ tag }}</a-tag>
        </span>
      </template>
      <template #action="{ record }" >
        <div >
          <slot :action="record"></slot>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { TableState } from "ant-design-vue/es/table/interface";
import { reactive, computed, onMounted, toRefs } from "vue";

export default {
  name: "CommonTable",
  props: {
    columns: Array,
    dataSource: Array,
    isPagination: Boolean,
    scrollX: {
      type: String,
      default: 'auto'
    },
  },
  setup(props:any) {
    const pagination = reactive({
      showSizeChanger: true,
      current: 1,
      pageSize: 10,
    })

    const paginationChange = (page: TableState['pagination']) => {
      const pageNumber = page?.current as number
      const pageSize = page?.pageSize as number
      pagination.current = pageNumber
      pagination.pageSize = pageSize
    }
    const timeFormat = (value: string) => {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }

    return {
      pagination,
      paginationChange,
      timeFormat,
    }
  }
};
</script>

<style scoped lang="less">
.common-table {
  margin-top: 20px;
}
</style>
