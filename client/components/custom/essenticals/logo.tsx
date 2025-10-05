"use client"

import { useSidebar } from "@/components/ui/sidebar"

const Logo = () => {
    const {open} = useSidebar()
  return (
    <div className={`w-full flex items-start ${open ? "justify-start" : "justify-center"}`}>
          {
              open ? <div className='flex flex-row items-end gap-1'>
                  <h1 className='text-3xl font-stretch-105%'><span className='font-bold underline text-primary'>Q</span>wikish</h1>
                  <p className='text-primary'>Socia</p>
              </div>:<div>
                  <h1 className='font-bold underline text-primary text-3xl'>Q</h1>
              </div>
          }
    </div>
  )
}

export default Logo