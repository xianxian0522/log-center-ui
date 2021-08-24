<template>
  <div>
    <FormCommon :is-query="true" :form="searchForm" @appChange="appChange" @bizChange="bizChange">
      <template v-slot:addConfig>
        <a-button @click="addConfiguration">添加</a-button>
      </template>
    </FormCommon>
    <a-spin :spinning="spinning" >
      <CommonTable :columns="columns" :data-source="logMonitorList" :is-pagination="true" :scroll-x="'1500px'">
        <template v-slot:default="slotProps">
          <a-button type="link" @click="updateConfiguration(slotProps.action)">编辑</a-button>
        </template>
      </CommonTable>
    </a-spin>

    <a-modal v-model:visible="modalVisible" :title="modalTitle" width="750px" :ok-button-props="{disabled: !modalIsValidate}" @ok="addConfigSubmit">
      <ConfigurationEdit ref="editRef" v-if="modalVisible" :mode="modalMode" :form="modalForm" @disabledChange="disabledChange" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref, toRefs, UnwrapRef } from "vue";
import logCenterRepository from "@/api/logCenterRepository";
import FormCommon from "@/components/FormCommon.vue";
import ConfigurationEdit from "@/views/ConfigurationEdit.vue";
import { MonitorInfoResponse } from "@/utils/response";
import CommonTable from "@/components/CommonTable.vue";

export interface SearchForm {
  bizId?: number;
  appId?: number;
}

export default {
  name: "LogConfiguration",
  components: { FormCommon, ConfigurationEdit, CommonTable },
  setup() {
    const searchForm: UnwrapRef<SearchForm> = reactive({
      bizId: undefined,
      appId: undefined
    })
    const modalState = reactive({
      modalVisible: false,
      modalTitle: '',
      modalIsValidate: false,
      modalForm: {},
      modalMode: ''
    })
    const editRef = ref()
    const columns = [
      { dataIndex: 'bizName', key: 'bizName', title: '业务名', fixed: 'left', width: 180 },
      { dataIndex: 'appName', key: 'appName', title: '应用名', },
      { dataIndex: 'instanceName', key: 'instanceName', title: '实例'},
      { dataIndex: 'logPath', key: 'logPath', title: '路径'},
      { dataIndex: 'logParseType', key: 'logParseType', title: '解析类型'},
      { dataIndex: 'expresion', key: 'expresion', title: '表达式', slots: { customRender: 'tags', }},
      { title: '操作', key: 'action', fixed: 'right', slots: { customRender: 'action', }, align: 'center', width: 120}
    ]
    const spinning = ref(false)
    const logMonitorList = ref<MonitorInfoResponse[]>([])

    const addConfiguration = () => {
      try {
        modalState.modalTitle = '新增配置'
        modalState.modalVisible = true
        modalState.modalIsValidate = false
        modalState.modalForm = {}
        modalState.modalMode = 'created'
      } catch (e) {
        console.error(e)
      }
    }
    const updateConfiguration = (ele: MonitorInfoResponse) => {
      try {
        modalState.modalTitle = '修改配置'
        modalState.modalVisible = true
        modalState.modalIsValidate = true
        modalState.modalForm = ele
        modalState.modalMode = 'edit'
      } catch (e) {
        console.error(e)
      }
    }
    const addConfigSubmit = async () => {
      try {
        await editRef.value?.configSubmit()
        modalState.modalVisible = false
        await queryInfoList()
      } catch (e) {
        modalState.modalVisible = false
        console.error(e)
      }
    }
    const queryInfoList = async () => {
      try {
        spinning.value = true
        logMonitorList.value = await logCenterRepository.queryMonitorInfo(searchForm)
        spinning.value = false
      } catch (e) {
        spinning.value = false
        console.error(e)
      }
    }
    const bizChange = (value: number) => {
      searchForm.bizId = value
      queryInfoList()
    }
    const appChange = (value: number) => {
      searchForm.appId = value
      queryInfoList()
    }
    const disabledChange = (value: boolean) => {
      modalState.modalIsValidate = value
    }
    onMounted(() => {
      queryInfoList()
    })

    return {
      columns,
      logMonitorList,
      editRef,
      searchForm,
      spinning,
      ...toRefs(modalState),
      addConfiguration,
      updateConfiguration,
      addConfigSubmit,
      disabledChange,
      bizChange,
      appChange,
    }
  },
};
</script>

<style scoped lang="less">

</style>
