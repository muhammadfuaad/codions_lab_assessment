// import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, notification, Space, Dropdown } from 'antd';
import { DownOutlined, UserOutlined} from '@ant-design/icons';
import type { FormProps } from 'antd';
import { useLocation } from 'react-router';

const TaskForm: React.FC = () => {
  const token = localStorage.getItem("token");
  console.log('token:', token);
  const options = {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const location = useLocation()
  const state = location.state
  const {
    id = null,
    name = '',
    description = '',
    due_date = null,
    status = ''
  } = state?.newTask || {};
  const projectId = state?.projectId || '';

  console.log("location:", location);

  console.log("state:", state);
  
  type FieldType = {
    name?: string;
    description?: string;
    due_date?: string;
    status?: string; 
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log("values:", values);
    if (location.pathname !== "/new_task") {
      axios.put(`https://task-manager.codionslab.com/api/v1/project/${projectId}/task/${id}`, values, options)
      .then(response => {
        notification.success({message: "Task Updated Successfully"})
      })
      .catch(error => {
        console.log("error:", error);
      });
    } else {
      axios.post(`https://task-manager.codionslab.com/api/v1/project/${state}/task`, {...values, parent_id: projectId},
        options)
      .then(response => {
        notification.success({message: "New Task Added Successfully"})
      })
      .catch(error => {
        console.log("error:", error);
      });
    }
    
    
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // const handleMenuClick: MenuProps['onClick'] = (e) => {
  //   console.log('click', e);
  // };
  
  // const items: MenuProps['items'] = [
  //   {
  //     label: '1st menu item',
  //     key: '1',
  //   },
  //   {
  //     label: '2nd menu item',
  //     key: '2',
  //   },
  //   {
  //     label: '3rd menu item',
  //     key: '3',
  //   },
  //   {
  //     label: '4rd menu item',
  //     key: '4',
  //   },
  // ];
  
  // const menuProps = {
  //   items,
  //   onClick: handleMenuClick,
  // };
  

  return (
    <div className='bg-gray-100 p-12 rounded-xl'>
      <h2 className='font-bold text-2xl mb-16'>{location.pathname !== "/new_task" ? "Update Task" : "New Task"}</h2>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        initialValues={(location.pathname !== "/new_task") ? { name, description, due_date, status, remember: true } : {remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Project Name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Project Description' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Due Date"
          name="due_date"
          rules={[{ required: true, message: 'Project Description' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Project Description' }]}
        >
          <Input />
          {/* <Dropdown menu={menuProps}>
            <Button>
              <Space>
                {status}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown> */}
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType='submit'>
            {location.pathname !== "/new_task" ? "Update Task" : "Add Task"}
          </Button>
        </Form.Item>
      </Form> 
    </div>
  );
};

export default TaskForm;