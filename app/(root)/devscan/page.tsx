import Navbar from '@/components/Navbar'
import Image from 'next/image'
import React from 'react'
import waves from "@/public/waves-light.svg";
import BlockSearch from '@/components/BlockSearch';
import TransactionSearch from '@/components/TransactionSearch';
const Devscan = () => {
  return (
    <div>
      <Navbar />
      <div className='h-60 w-full bg-[#727ff2] relative'>
        <Image 
          src={waves} 
          alt='Waves' 
          layout="fill" 
          objectFit="cover" 
          className='absolute inset-0' 
        />
        <p className='text-white text-center text-4xl pt-10'>DevScan Explorer</p>

      </div>
      <BlockSearch />
      <TransactionSearch />
    </div>
  )
}

export default Devscan;
