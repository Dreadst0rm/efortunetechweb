import type { ReactNode } from 'react'
import Footer from '../components/Footer'
import Nav, { type NavPage } from '../components/Nav'

export default function Shell({
  active,
  children,
}: {
  active: NavPage
  children: ReactNode
}) {
  return (
    <>
      <Nav active={active} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
