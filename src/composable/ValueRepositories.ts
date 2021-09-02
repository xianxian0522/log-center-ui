import logCenterRepository from "@/api/logCenterRepository";

export default function valueRepositories() {

  const getValues = async (labelName: string, params?: any) => {
    try {
      const data = await logCenterRepository.queryLabelsValue(labelName, params)
      return data.data
    } catch (e) {
      console.error(e)
    }
  }

  return {
    getValues
  }
}
