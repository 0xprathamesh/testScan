import Layout from '@/components/newui/Layout';
import React from 'react'

interface TokenProps {
    address: string;
  }
const Token:React.FC<TokenProps> = ({address}) => {
  return (
      <Layout>
          <div>Token</div>
    </Layout>
  )
}

export default Token;