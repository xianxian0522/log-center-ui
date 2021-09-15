<template>
  <div>
    <div class="show-content-more-pre">
      <a-spin :spinning="spinning">
        <div class="content-message">
          <ul>
            <li v-for="forward in forwardList" :key="forward.oldTime">
              <div class="context-message">{{ forward.message }}</div>
            </li>
          </ul>
        </div>
        <div class="content-message-count">
          <span class="content-message-count-span">Found 10 rows.</span>
        </div>
      </a-spin>
    </div>
    <div class="show-content-more">
      <a-spin :spinning="spinning">
        <div class="content-message">
          <ul>
            <li v-for="backward in backwardList" :key="backward.oldTime">
              <div class="context-message">{{ backward.message }}</div>
            </li>
          </ul>
        </div>
        <div class="content-message-count">
          <span class="content-message-count-span">Found 10 rows.</span>
        </div>
      </a-spin>
    </div>
    <div style="clear: both"></div>
  </div>
</template>

<script lang="ts">
import logCenterRepository from "@/api/logCenterRepository";
import { onMounted, ref } from "vue";
import { LogCenterList } from "@/utils/response";
import { flattenLogResult } from "@/composable/commonRepositories";

export default {
  name: "LogContext",
  props: {
    contextParams: Object,
    contextQuery: Object,
  },
  setup(props: any) {
    const backwardList = ref<LogCenterList[]>([])
    const forwardList = ref<LogCenterList[]>([])
    const spinning = ref(true)

    const queryContext = async () => {
      try {
        spinning.value = true
        const data = await logCenterRepository.queryLogContext(props.contextParams, props.contextQuery)
        spinning.value = false
        backwardList.value = flattenLogResult(data.backward.data.result)
        forwardList.value = flattenLogResult(data.forward.data.result)
      } catch (e) {
        console.error(e)
      }
    }
    onMounted(() => {
      queryContext()
    })

    return {
      spinning,
      backwardList,
      forwardList,
    }
  }
};
</script>

<style scoped lang="less">
.show-content-more-pre {
  top: -260px;
}
.show-content-more {
  top: 100%;
}
.show-content-more, .show-content-more-pre {
  position: absolute;
  width: calc(100% + 20px);
  left: -13px;
  z-index: 12;
  overflow: hidden;
  background: #fff;
  box-shadow: rgb(255 255 255) 0 0 10px;
  border: 1px solid #eee;
  border-radius: 4px;

  .content-message {
    height: 220px;
    padding: 10px;

    ul {
      height: inherit;
      overflow: auto;
      list-style: none;
      padding: 0 0 10px 0;
      margin: 0;

      .context-message {
        padding: 5px 0;
        font-size: 12px;
      }
    }
  }
  .content-message-count {
    height: 30px;
    padding: 0 10px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    background: #eee;

    .content-message-count-span {
      opacity: 0.6;
    }
  }
}
</style>
