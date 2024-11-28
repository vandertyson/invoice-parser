import {
  DownloadOutlined,
  InboxOutlined,
  DeleteOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { Button, Flex, Splitter, Typography, Upload, message, Table, Space } from "antd";
import { createStyles } from "antd-style";
import { useState } from "react";
import ConfigModal from "./ConfigModal"
import { Divider } from 'antd';


const { Dragger } = Upload;

const App = () => {
  const [size, setSize] = useState("large");
  const [files, setFiles] = useState([]);
  const [xlsxFile, setXlsxFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false); // Trạng thái nút Parse
  const [isConfigVisible, setIsConfigVisible] = useState(false); // Trạng thái Dialog Configuration

  // Xử lý upload file cho vùng upload nhiều file
  const handleMultipleUpload = ({ file }) => {
    const newFile = {
      key: file.uid,
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      type: file.type || 'Unknown',
      status: 'ready',
    };

    // Kiểm tra nếu file đã tồn tại
    setFiles((prevFiles) => {
      const isFileExists = prevFiles.some((f) => f.name === file.name && f.size === newFile.size);
      return isFileExists ? prevFiles : [...prevFiles, newFile];
    });
  };

  // Xử lý upload file cho vùng chỉ upload 1 file xlsx
  const handleXlsxUpload = (info) => {
    const { file } = info;

    if (!file.name.endsWith('.xlsx')) {
      message.error('Only .xlsx files are allowed!');
      return;
    }

    // Cập nhật file mới thay thế file cũ
    setXlsxFile({
      key: file.uid,
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      status: 'ready',
    });

    message.success('Uploaded 1 XLSX file successfully!');
  };


  const handleParse = () => {
    setIsParsing(true); // Kích hoạt trạng thái parsing

    const updateFileStatus = (file, newStatus) => {
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.key === file.key ? { ...f, status: newStatus } : f
        )
      );
    };

    files.forEach((file, index) => {
      setTimeout(() => updateFileStatus(file, 'uploading'), index * 1000);
      setTimeout(() => updateFileStatus(file, 'processing'), index * 2000);
      setTimeout(() => updateFileStatus(file, 'finish'), index * 3000);
    });

    // Kết thúc quá trình parsing
    setTimeout(() => {
      setIsParsing(false);
      message.success('Parsing completed!');
    }, files.length * 3000);
  };

  const handleDelete = (key) => {
    setFiles(files.filter((file) => file.key !== key));
    message.success('File deleted successfully');
  };

  const handleRefresh = (key) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.key === key ? { ...file, status: 'processing' } : file
      )
    );
    setTimeout(() => {
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.key === key ? { ...file, status: 'finish' } : file
        )
      );
    }, 2000);
    message.info('File refreshed successfully');
  };

  const handleConfigApply = (values) => {
    console.log('Configurations:', values);
    message.success('Cấu hình đã được áp dụng!');
    setIsConfigVisible(false);
  };

  const columnsFile = [
    {
      title: 'Thông tin file',
      dataIndex: 'fileInfo',
      key: 'fileInfo',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{record.name}</div>
          <div style={{ fontSize: '12px', color: 'gray' }}>{record.type}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.size}</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150, // Đặt độ rộng cố định
      render: (status) => {
        const statusColors = {
          ready: 'gray',
          uploading: 'blue',
          processing: 'orange',
          finish: 'green',
        };
        return (
          <span style={{ color: statusColors[status], fontWeight: 'bold' }}>
            {status.toUpperCase()}
          </span>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150, // Đặt độ rộng cố định
      render: (_, record) => (
        <Space>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
            danger
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => handleRefresh(record.key)}
          />
        </Space>
      ),
    },
  ];


  const useStyle = createStyles(({ css, token }) => {
    const { antCls } = token;
    return {
      customTable: css`
				${antCls}-table {
					${antCls}-table-container {
						${antCls}-table-body,
						${antCls}-table-content {
							scrollbar-width: thin;
							scrollbar-color: #eaeaea transparent;
							scrollbar-gutter: stable;
						}
					}
				}
			`,
    };
  });

  const columns = [
    {
      title: 'Full Name',
      width: 100,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: 'Age',
      width: 100,
      dataIndex: 'age',
      key: 'age',
      fixed: 'left',
    },
    {
      title: 'Column 1',
      dataIndex: 'address',
      key: '1',
      width: 150,
    },
    {
      title: 'Column 2',
      dataIndex: 'address',
      key: '2',
      width: 150,
    },
    {
      title: 'Column 3',
      dataIndex: 'address',
      key: '3',
      width: 150,
    },
    {
      title: 'Column 4',
      dataIndex: 'address',
      key: '4',
      width: 150,
    },
    {
      title: 'Column 5',
      dataIndex: 'address',
      key: '5',
      width: 150,
    },
    {
      title: 'Column 6',
      dataIndex: 'address',
      key: '6',
      width: 150,
    },
    {
      title: 'Column 7',
      dataIndex: 'address',
      key: '7',
      width: 150,
    },
    {
      title: 'Column 8',
      dataIndex: 'address',
      key: '8',
    },
    {
      title: 'Column 9',
      dataIndex: 'address',
      key: '9',
    },
    {
      title: 'Column 10',
      dataIndex: 'address',
      key: '10',
    },
    {
      title: 'Column 11',
      dataIndex: 'address',
      key: '11',
    },
    {
      title: 'Column 12',
      dataIndex: 'address',
      key: '12',
    },
    {
      title: 'Column 13',
      dataIndex: 'address',
      key: '13',
    },
    {
      title: 'Column 14',
      dataIndex: 'address',
      key: '14',
    },
    {
      title: 'Column 15',
      dataIndex: 'address',
      key: '15',
    },
    {
      title: 'Column 16',
      dataIndex: 'address',
      key: '16',
    },
    {
      title: 'Column 17',
      dataIndex: 'address',
      key: '17',
    },
    {
      title: 'Column 18',
      dataIndex: 'address',
      key: '18',
    },
    {
      title: 'Column 19',
      dataIndex: 'address',
      key: '19',
    },
    {
      title: 'Column 20',
      dataIndex: 'address',
      key: '20',
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: () => <a>action</a>,
    },
  ];
  const dataSource = Array.from({
    length: 100,
  }).map((_, i) => ({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  }));

  const props = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const Desc = (props) => (
    <Flex justify="center" align="center" style={{ height: "100%" }}>
      <Typography.Title
        type="secondary"
        level={5}
        style={{ whiteSpace: "nowrap" }}
      >
        {props.text}
      </Typography.Title>
    </Flex>
  );

  const { styles } = useStyle();

  return (
    <>
      <Splitter
        style={{ height: "100vh", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", maxWidth: "100vw" }}
      >
        <Splitter.Panel defaultSize="30%" min="20%" max="70%">
          <div>
            <Divider orientation="left"><h3>Upload file template</h3></Divider>
            <Dragger
              beforeUpload={() => false}
              onChange={handleXlsxUpload}
              showUploadList={false}
            // style={{ marginBottom: '16px' }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Kéo/thả hoặc chọn file XLSX
              </p>
            </Dragger>
            {xlsxFile && (
              <div style={{ marginTop: '8px', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
                <strong>{xlsxFile.name}</strong>
                <div>Loại: {xlsxFile.type}</div>
                <div>Kích thước: {xlsxFile.size}</div>
              </div>
            )}
          </div>
          <div>
            <Divider orientation="left"><h3>Upload các file cần parse</h3></Divider>
            <Dragger
              multiple
              beforeUpload={() => false}
              onChange={handleMultipleUpload}
              showUploadList={false}
            // style={{ marginBottom: '16px' }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Kéo/thả hoặc chọn nhiều file
              </p>
            </Dragger>
          </div>
          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <Button
              type="primary"
              size="large"
              style={{
                width: '200px',
                height: '50px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
              onClick={handleParse}
              disabled={isParsing || !(files.length > 0 && xlsxFile)}
            >
              {isParsing ? 'Đang chuyển đổi...' : 'Chuyển đổi'}
            </Button>
            <div style={{ marginTop: '8px' }}>
              <a href="#" onClick={() => setIsConfigVisible(true)}>
                Tùy chọn
              </a>
            </div>
          </div>

          {files.length > 0 && (<Table
            dataSource={files}
            columns={columnsFile}
            pagination={{
              pageSize: 2, // Số dòng hiển thị trên mỗi trang
              showSizeChanger: false, // Ẩn chức năng chọn số dòng mỗi trang
            }}
          />)}
        </Splitter.Panel>
        <Splitter.Panel style={{ overflow: "hidden", padding: "15px" }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
            }}
          >
            <h1 style={{ margin: 0 }}>Xem trước</h1>
            <div>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                size={size}
                style={{ margin: "0 25px 0 0" }}
              >
                Tải xuống
              </Button>
            </div>
          </div>
          <Table
            className={styles.customTable}
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: "max-content", y: "75vh" }}
          />
        </Splitter.Panel>
      </Splitter>
      <ConfigModal
        visible={isConfigVisible}
        onCancel={() => setIsConfigVisible(false)}
        onApply={handleConfigApply}
      />
    </>
  );
};

export default App;
