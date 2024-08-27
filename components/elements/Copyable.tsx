import React from 'react'
import toast from "react-hot-toast";
import {HiOutlineDuplicate} from "react-icons/hi"
type Props = {
    text: string
    copyText?:string
}
const notify = () => toast.success("Copied To ClipBoard");

const Copyable = (props: Props) => {
    const copyToClipboard = () => {
        window.navigator.clipboard.writeText(props.copyText || props.text);
        notify();
    }
    
  return (
    <span onClick={copyToClipboard} className='relative max-w-fit  group cursor-pointer  flex items-center gap-2 rounded-full px-2 py-1 bg-gray-100'>
          <p className='dark-blue opacity-60'>{props.text}</p>
          <HiOutlineDuplicate className="h-6 w-6 group-active:scale-95 text-gray-500" />
    </span>
  )
}

export default Copyable