// This is a sample file to show the usage of the composable.
export default function useExample() {
  const str = ref('Hello World!')
  const changeStr = (newStr: string) => {
    str.value = newStr
  }
  return {
    str,
    changeStr,
  }
}
