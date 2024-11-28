import { Modal, Form, Table, Radio, Button, Slider, Row, Col, InputNumber } from 'antd';
import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
const { TextArea } = Input;

const ConfigModal = ({ visible, onCancel, onApply }) => {
    const [form] = Form.useForm();
        
    // Dữ liệu bảng
    const data = [        
        {
            key: 'ms365',
            name: 'MS365',
            logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS214JlU84O7dpe16IvRnGSTZticm-wntsYug&s',
            price: '2$/1000 tokens',
            style: { width: "200px", height: '70px' },
            description: 'MS365 engine is cost-effective and integrates well with Microsoft services.',
        },
        {
            key: 'openai',
            name: 'OpenAI',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/512px-OpenAI_Logo.svg.png?20230731013808',
            price: '3$/1000 tokens',
            style: { width: "200px", height: '50px' },
            description: 'OpenAI engine specializes in language models with high accuracy and reliability.',
        },
        {
            key: 'ollama',
            name: 'Ollama',
            logo: 'https://ollama.com/assets/library/gemma2/58a4be20-b402-4dfa-8f1d-05d820f1204f',
            price: 'Free',
            style: { width: "200px", height: '50px' },
            description: 'Ollama is a free engine, ideal for lightweight and basic parsing tasks.',
        },
    ];

    const [selectedEngine, setSelectedEngine] = useState(data[0].key);   

    // Cấu hình cột
    const columns = [
        {
            title: '',
            dataIndex: 'radio',
            key: 'radio',
            render: (_, record) => (
                <Radio
                    checked={selectedEngine === record.key}
                    onChange={() => setSelectedEngine(record.key)}
                />
            ),
            width: 50, // Độ rộng cho cột radio
        },
        {
            title: 'AI Engine',
            dataIndex: 'logo',
            key: 'logo',
            render: (_, record) => <img src={record.logo} alt="logo" style={record.style} />,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 200, // Độ rộng cho cột price
            render: (_, record) => <div style={{textAlign: 'center'}}>{record.price}</div>,
        },
        Table.EXPAND_COLUMN,
    ];

    // Sử dụng trạng thái để điều khiển việc mở rộng hàng
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);


    const [confidence, setConfidence] = useState(0.9);
    const onChange = (value) => {
        if (Number.isNaN(value)) {
            return;
        }
        setConfidence(value);
    };
    const formatter = (value) => `${value * 100}%`;

    return (
        <Modal
            title="Cấu hình"
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button
                    key="apply"
                    type="primary"
                    onClick={() => {
                        form.validateFields().then(() => {
                            onApply(selectedEngine);
                        });
                    }}
                    disabled={!selectedEngine} // Disable nút nếu chưa chọn engine
                >
                    Áp dụng
                </Button>,
            ]}
            width={600} // Cỡ modal trung bình
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Chọn Parser Engine"
                    name="parserEngine"
                    // rules={[{ required: true, message: 'Vui lòng chọn Parser Engine!' }]}
                >
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        expandedRowKeys={expandedRowKeys}
                        onExpand={(expanded, record) => {
                            const expandedKeys = expanded ? [record.key] : [];
                            setExpandedRowKeys(expandedKeys);
                        }}
                        expandable={{
                            expandedRowRender: (record) => <p>{record.description}</p>, // Phần mở rộng
                        }}
                        rowKey="key" // Đảm bảo bảng nhận dạng row bằng key
                    />
                </Form.Item>
                <Form.Item
                    label="Độ tin cậy"
                    name="reliability"
                    // rules={[{ required: true, message: 'Vui lòng chọn độ tin cậy!' }]}
                >
                    <Slider
                        min={0}
                        max={1}
                        onChange={onChange}
                        value={typeof confidence === 'number' ? confidence : 0}
                        step={0.01}
                        tooltip={{
                            formatter,
                        }}
                        defaultValue={confidence}
                    />
                </Form.Item>

                {/* Prompt */}
                <Form.Item label="Prompt" name="prompt">
                    <TextArea rows={6} placeholder="Điền prompt của bạn vào đây"/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ConfigModal;
