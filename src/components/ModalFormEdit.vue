<template>
  <div>
    <TagForm v-for="(item, index) in modalForm" :form="item" :index="index"
             @addLabelValue="addLabelValue" :key="item.label + index" :end-time="endTime" :start-time="startTime" />
    <div class="modal-form-edit">
      <a-button @click="addOkLabel">确定</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import TagForm from "@/components/TagForm.vue";
import { LabelValue } from "@/utils/response";
import { reactive, toRefs, UnwrapRef } from "vue";
import { message } from "ant-design-vue";

export interface ModalState {
  modalVisible: boolean,
  modalForm: LabelValue[],
  modalLabel: LabelValue[],
}

export default {
  name: "ModalFormEdit",
  components: {TagForm},
  props: {
    startTime: Object,
    endTime: Object,
  },
  emits: ['handleAddLabel'],
  setup(props: any, {emit}: any) {
    const modalState: UnwrapRef<ModalState> = reactive({
      modalVisible: false,
      modalForm: [{label: '', value: []}],
      modalLabel: [],
    })

    const addLabelValue = (obj: any) => {
      const [formState, index, label] = obj
      const isHas = modalState.modalLabel.findIndex(item => item.label === label)
      if (isHas === -1) {
        modalState.modalLabel[index] = formState
        if (modalState.modalLabel[modalState.modalLabel.length - 1].label !== '') {
          modalState.modalForm.push({label: '', value: []})
          modalState.modalLabel.push({label: '', value: []})
        }
      } else {
        message.warning(`${label}已经存在或者有空值`)
      }
    }
    const addOkLabel = () => {
      const obj: any = {}
      modalState.modalLabel.forEach(item => {
        if (item.label) {
          obj[item.label] = item.value
        }
      })
      emit('handleAddLabel', obj)
      console.log(modalState.modalLabel, obj)
    }

    return {
      ...toRefs(modalState),
      addLabelValue,
      addOkLabel,
    }
  }
};
</script>

<style scoped lang="less">
.modal-form-edit {
  padding: 10px 26px;
  text-align: right;
  background: transparent;
  margin-top: 20px;
  border-radius: 0 0 2px 2px;
}
</style>
