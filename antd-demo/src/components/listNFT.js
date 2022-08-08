import { Card } from 'antd';
import React, { useEffect } from 'react';
import GetMintedList from './api/getList';
import './list.css';
const { Meta } = Card;


const ListNFTs = () => {
  useEffect(() => {
    console.log("executed only once!");
    console.log(GetMintedList());
  }, [""]);

  return (
    <>
      <h1>In Progress...</h1>
      <div className='parent'>
        <Card
          hoverable
          style={{
            width: 240,
          }}
          cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
          className="child"
        >
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <Card
          hoverable
          style={{
            width: 240,
          }}
          cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
          className="child"
        >
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <Card
          hoverable
          style={{
            width: 240,
          }}
          cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
          className="child"
        >
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <Card
          hoverable
          style={{
            width: 240,
          }}
          cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
          className="child"
        >
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
      </div>
      
    </>
  )
}

export default ListNFTs;
