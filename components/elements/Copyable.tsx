import React from 'react'
import toast from "react-hot-toast";
import { HiOutlineDuplicate } from "react-icons/hi"

type Props = {
    text: string
    copyText?: string
    className?: string
}

const notify = () => toast.success("Copied To Clipboard");

const Copyable = (props: Props) => {
    const { text, copyText, className = '' } = props;

    const copyToClipboard = () => {
        window.navigator.clipboard.writeText(copyText || text);
        notify();
    }

    return (
        <span 
            onClick={copyToClipboard} 
            className={`relative max-w-fit group cursor-pointer flex items-center gap-2 rounded-full px-2 py-1 ${className} `}
        >
            <p className='dark-blue opacity-60'>{text}</p>
            <HiOutlineDuplicate className="h-4 w-4 group-active:scale-95 text-gray-500" />
        </span>
    )
}

export default Copyable;
