import { memo, useState } from 'react'

export function Widget({ open, items }) {
  if (open) {
    useState(0)
  }
  return items.map((item) => <li>{item}</li>)
}

export const Memoized = memo(() => <Widget />)

export default () => <Widget />
