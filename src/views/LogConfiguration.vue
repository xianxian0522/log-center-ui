<template>
  <div>
    <FormCommon :form="searchForm">
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
import { onMounted, reactive, ref, toRefs } from "vue";
import logCenterRepository from "@/api/logCenterRepository";
import FormCommon from "@/components/FormCommon.vue";
import ConfigurationEdit from "@/views/ConfigurationEdit.vue";

export default {
  name: "LogConfiguration",
  components: { FormCommon, ConfigurationEdit },
  setup() {
    const searchForm = reactive({
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
    const addConfigSubmit = () => {
      console.log('add con')
      editRef.value?.configSubmit()
    }
    const queryInfoList = async () => {
      try {
        const data = await logCenterRepository.queryMonitorInfo(26)
        console.log(data)
      } catch (e) {
        console.error(e)
      }
    }
    onMounted(() => {
      // queryInfoList()
    })
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
    }
  },
};
</script>

<style scoped lang="less">

</style>
