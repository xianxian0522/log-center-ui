<template>
  <div>
    <FormCommon :form="searchForm" @appChange="appChange" @bizChange="bizChange">
      <template v-slot:addConfig>
        <a-button @click="addConfiguration">添加</a-button>
      </template>
    </FormCommon>

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

export interface SearchForm {
  bizId?: number;
  appId?: number;
}

export default {
  name: "LogConfiguration",
  components: { FormCommon, ConfigurationEdit },
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
    const addConfigSubmit = async () => {
      try {
        await editRef.value?.configSubmit()
        modalState.modalVisible = false
      } catch (e) {
        modalState.modalVisible = false
        console.error(e)
      }
    }
    const queryInfoList = async () => {
      try {
        const data = await logCenterRepository.queryMonitorInfo(searchForm)
        console.log(data)
      } catch (e) {
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

    return {
      editRef,
      searchForm,
      ...toRefs(modalState),
      addConfiguration,
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
