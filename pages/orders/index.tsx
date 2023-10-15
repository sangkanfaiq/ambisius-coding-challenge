import { TipLabel } from '@components/custom'
import React, { useState } from 'react'
import {
  Tabs
} from "antd";
import Table1 from './table1';
import Table2 from './table2';
import Table3 from './table3';

const OrdersPage = () => {
  const [tableNumber, setTableNumber] = useState("1")

  function handleChange(key: string) {
    setTableNumber(key)
  }


  return (
    <div className="min-h-screen">
      <div className="p-4 bg bg-white">
        <TipLabel title="Orders" />
      </div>

      <div className="p-4 bg bg-white mt-2.5">
        <Tabs defaultActiveKey="1" type="card" onChange={handleChange}>
          <Tabs.TabPane tab="Table 1" key="1">
            <Table1 tableNumber={tableNumber}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Table 2" key="2">
            <Table2 tableNumber={tableNumber}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Table 3" key="3">
            <Table3 tableNumber={tableNumber}/>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default OrdersPage