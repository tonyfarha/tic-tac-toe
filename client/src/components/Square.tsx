
export default function Square({ val, makeMove }: any) {
  return (
    <button disabled={val} onClick={() => makeMove()}>{val}</button>
  )
}
