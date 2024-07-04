import axios from 'axios';
import { Button, notification, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import { useLocation } from 'react-router';

const ProjectForm: React.FC = () => {
  const token = localStorage.getItem("token");
  console.log('token:', token);
  const options = {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const location = useLocation()
  const projectData = location.state
  console.log("location:", location);

  console.log("projectData:", projectData);
  
  type FieldType = {
    name?: string;
    description?: string;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log("values:", values);
    const id = projectData?.id
    if (projectData !== null) {
      console.log(`${id} clicked`);
      axios.put(`https://task-manager.codionslab.com/api/v1/admin/project/${id}`, {...projectData, name: values.name,
        description: values.description} , options)
      .then(response => {
        console.log("(update project api) response:", response);
        notification.success({
          message: 'Project Updated Successfully',
        });
      })
      .catch(error => {
        console.log("(update project api) error:", error);
      });
    } else {
      axios.post("https://task-manager.codionslab.com/api/v1/admin/project", values, options)
      .then(response=>{
      console.log("response:", response);
      notification.success({message: "Project Added Successfully"})
      }).catch(error=>{notification.error(error)})
    }
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='bg-gray-100 p-12 rounded-xl'>
      <h2 className='font-bold text-2xl mb-16'>{projectData == null ? "Add New project" : "Update Project"}</h2>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        initialValues={(location !== null) ? { name: projectData?.name, description: projectData?.description, 
          contributors: projectData?.users.map((user)=>user.name), remember: true } : {remember: true }}
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

        {/* <Form.Item<FieldType>
          label="Contributors"
          name="contributors"
          rules={[{ message: 'Add Controbutors' }]}
        >
          <Input />
        </Form.Item> */}

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType='submit'>
            {(projectData === null) ? "Create New project" : "Update project"}
          </Button>
        </Form.Item>
      </Form> 
    </div>
  );
};

export default ProjectForm;