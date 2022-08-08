import { Button, Form, Input, Upload, message, Spin, Modal, Typography, Image, Card, Progress } from 'antd';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import PostMintReq from './api/submitMint';
import TnxResult from './result';
import NOTIFICATION_DETAILS from './constants/message';

const UPLOAD_URL = process.env.REACT_APP_UPLOAD_URL;
const { Title, Paragraph, Text, Link } = Typography;
const { Meta } = Card;
const { TextArea } = Input;


const Minter = () => {
  const [isLoading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [resultInfo, setResultInfo] = useState({});

  const [form] = Form.useForm();

  const props = {
    name: 'file',
    multiple: false,
    action: UPLOAD_URL,
  
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const onUploadChange = (info) => {
    const { status } = info.file;

    console.log(info.file.status, 'here')
    console.log(info.file.name, 'here')
    console.log(info.file, 'here')
    console.log(info.file.thumbUrl, 'thumbUrl')
    console.log(info.file.originFileObj)

    if (status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }

    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } 
    
    else if (status === 'error') {
      message.error(`${info.file.name} file upload failed. ${info.file.response.message}`);
    }
  }

  const onFinish = (values) => {
    console.log('Success:', values);
    console.log(process.env)
  };

  const onFinishFailed = (errorInfo) => {
    console.log(UPLOAD_URL)
    console.log('Failed:', errorInfo);
  };

  const handleSubmission = React.useCallback(
    (result) => {
      const status = result.response
      if (status.code == 1 || result == undefined) {
        // Handle Error here
        showResult({
          status: "error",
          title: NOTIFICATION_DETAILS["error"].title,
          subTitle: status.message
        });
      } else {
        
        // Handle Success here
        form.resetFields();
        showResult({
          status: "success",
          title: NOTIFICATION_DETAILS["success"].title,
          subTitle: status.message
        });
      }
    },
    [form]
  );

  const onSubmit = React.useCallback(async () => {
    
    let values;
    try {
      values = await form.validateFields();
      values.fileIdentifier = values.fs[0].name;
      delete values.fs;     
      setLoading(true);  
    } catch (errorInfo) {
      return;
    }

    const result = await PostMintReq(values); // Submit the form data to the backend
    handleSubmission(result); // Handle the submission after the API Call
  }, [form, handleSubmission]);

  const normFile = (e) => {
  
    if (Array.isArray(e)) {
      return e;
    }
  
    return e?.fileList;
  };

  const showResult = (result) => {
    setIsModalVisible(true);
    setResultInfo(result);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setLoading(false);
    setResultInfo({});
  };

  return (
    <>
      <Modal 
        visible={isModalVisible}
        width={1000}
        onOk={handleOk}
        onCancel={handleOk}
      >
        <TnxResult props={resultInfo}/>
      </Modal>
      <div className='overlay'>
        {/* <div className='previewImage' style={{marginRight: "30px"}}>
          <Card
            hoverable
            bordered={false}
            style={{
              width: 240,
              backgroundColor: "#466a1112"
            }}
          >
            <Image
              width={200}
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
            <Meta title="Your NFT" description="Preview " style={{paddingTop: "23px"}}/>
            
            <Progress percent={30} />
            <p>Strength</p>

            <Progress percent={30} />
            
          </Card>
        </div> */}
        <div className='overlay__inner'>
            <h1 className="overlay__title ">
              Mint OZ
            </h1>

            <p className="overlay__description">
              <Paragraph>
                Mint your own NFT, by using Mint OZ.  
                Image will be upload on IPFS network. You can check your minted NFT on opensea marketplace too. Strictly prohibit from uploading company data or other band files
              </Paragraph>
            </p>

            <Form
              name="mintForm"   
              wrapperCol={{
                span: 16,
              }}
              labelCol={{
                span: 6,
              }}
              autoComplete="on"
              onFinish={onFinish}
              form={form}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="NFT Name (✨)"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Please input your nft name!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Description (🤷‍♂️)"
                name="description"
                rules={[
                  {
                    required: true,
                    message: 'Please input your description for your NFT!',
                  },
                ]}
              >
                
                <TextArea rows={4} placeholder="maxLength is 30" maxLength={30} />
              </Form.Item>

              <Form.Item 
                label="Upload 🎈"
                valuePropName="fileList"
                name="fs"
                rules={[
                  {
                    required: true,
                    message: 'Please upload your NFT file!',
                  },
                ]}
                getValueFromEvent={normFile}
              >
                <Upload {...props} listType="picture-card" maxCount={1} onChange={onUploadChange}>
                  <div>
                    <PlusOutlined />
                    {/* <div style={{ marginTop: 8 }}>Upload</div> */}
                  </div>
                </Upload>
                
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 3
                }}
              >
                <Spin spinning={isLoading} tip="Minting 🎡" style={{color: "white", textShadow: "0 1px 2px #9b91d4"}}>
                    { !isLoading &&
                      <Button style={{width: "100%"}} type="primary" htmlType="submit" onClick={onSubmit}>
                        mint 🐱‍🏍 
                      </Button>
                    }
                </Spin>
                  
                
              </Form.Item>
            </Form>
        </div>
      </div>
    </>
  )
}

export default Minter;
