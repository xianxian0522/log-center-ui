import logCenterRepository from "@/api/logCenterRepository";

export default function valueRepositories() {

  const getValues = async (labelName: string) => {
    try {
      const data = await logCenterRepository.queryLabelsValue(labelName)
      return data.data
    } catch (e) {
      console.error(e)
    }
  }

  return {
    getValues
  }
}
