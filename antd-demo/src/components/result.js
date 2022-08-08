import { Button, Result } from 'antd';
import React from 'react';

const TnxResult = ({props}) => (
  <Result
    status={props.status}
    title={props.title}
    subTitle={props.subTitle}
  />
);

export default TnxResult;