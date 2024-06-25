// import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Spin, notification, Space, Avatar, Select } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

const Show: React.FC = () => {
  const [projectData, setProjectData] = useState({})
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  // const [projectId, setProjectId] = useState(null)
  const [taskId, setTaskId] = useState(null)


  const users = localStorage.getItem("users")
  console.log("users:", users);
  console.log("localStorage:", localStorage);
const navigate = useNavigate()
  

  const {name, description, is_active} = projectData
  const location = useLocation()
  const id = location.state.id
  const projectId = location.state.id

  const savedToken = location.state.savedToken
  
  console.log("isEdit:", isEdit);
  console.log("location.state.isUpdate:", location.state.isUpdate);

  
  const options = {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${savedToken}`,
    },
  };
  useEffect(()=>{
    if (location && location.state.isUpdate) {
      setIsEdit(true)
    }
    axios.get(`https://task-manager.codionslab.com/api/v1/project/${projectId}`, options)
    .then(response => {
      setProjectData(response.data.data)
      setLoading(false)
    })
    .catch(error => {
      setLoading(false);
      console.log("error:", error);
    });

    axios.get(`https://task-manager.codionslab.com/api/v1/project/${projectId}/task`, options)
    .then(response => {
      setTasks(response.data.data)
      setLoading(false)
    })
    .catch(error => {
      setLoading(false);
      console.log("error:", error);
    });
    console.log("tasks:", tasks);
    // setProjectId(location.state.id)

  }, [])

  const deleteProject = (id: number) => {
    console.log(`${id} clicked`);
    axios.delete(`https://task-manager.codionslab.com/api/v1/admin/project/${id}`, options)
      .then(response => {
        console.log("(delete project api) response:", response);
        notification.success({
          message: 'Project Deleted Successfully',
        });
      })
      .catch(error => {
        console.log("(delete project api) error:", error);
      });
  }

  const updateProject = (id: number) => {
    console.log(`${id} clicked`);
    axios.put(`https://task-manager.codionslab.com/api/v1/admin/project/${id}`, projectData, options)
    .then(response => {
      console.log("(update project api) response:", response);
      notification.success({
        message: 'Project Updated Successfully',
      });
    })
    .catch(error => {
      console.log("(update project api) error:", error);
    });
    setIsEdit(false)
  }

  // task actions
  const deleteTask = (taskId: number) => {
    // const taskId = id 
    console.log("taskId:", taskId);
    console.log("id:", id);
    axios.delete(`https://task-manager.codionslab.com/api/v1/project/${id}/task/${taskId}`, options)
    .then(response => {
      console.log("(delete task api) response:", response);
      notification.success({
        message: 'Task Deleted Successfully',
      });
    })
    .catch(error => {
      console.log("(delete task api) error:", error);
    });
    
  }
  if (loading) {
    return <Spin size="large" />;
  }
  const contributors = projectData.users
  // const nonContributors = users.filter(user => !contributors.some(contributor => contributor.id === user.id));

  
  return (
    <>
      <Card title={`${id}) ${name}`} extra={<a onClick={()=> showProject(id)}>More</a>} style={{ width: 300,
        height: "fit-content" }}>
        <p>{description}</p>
        <p>Contributors:
          <Space size={16} wrap>
            {contributors.map((contributor)=>{
              return ( 
                <>
                  <Avatar size={30} gap={2}>{contributor.name}</Avatar>
                </>
              )
            })} 
          </Space>
        </p>
        <h3>Tasks:</h3>
        {tasks.map((task)=>{
          const {id, name, description, due_date, assignee_id, status, created_at, updated_at } = task
          return (
            <div style={{background: "skyblue", border: "1px solid navy-blue"}}>
              <div><h4 style={{display: "inline"}}>Task Id: </h4>{id}</div>
              <div><h4 style={{display: "inline"}}>Description: </h4>{description}</div>
              <div><h4 style={{display: "inline"}}>Added By: </h4>{name}</div>
              <div><h4 style={{display: "inline"}}>Contributors: </h4>{assignee_id}</div>
              <div><h4 style={{display: "inline"}}>Status: </h4>{status}</div>
              <div><h4 style={{display: "inline"}}>Added at: </h4>{created_at}</div>
              <div><h4 style={{display: "inline"}}>Updated at: </h4>{updated_at}</div>
              <div><h4 style={{display: "inline"}}>Due date: </h4>{due_date}</div>
              <Button type="primary" onClick={() => navigate("/edit_task", {state: {task, projectId}})}>
                Update
              </Button>
              <Button type="primary" onClick={() => deleteTask(id)}>
                Delete
              </Button>
            </div>
          )
        })}
        <Button type="primary" onClick={() => navigate("/projects/new", {state: projectData})}>
          Update
        </Button>
        <Button type="primary" onClick={() => deleteProject(id)}>
          Delete
        </Button>
      </Card>
    </>
  );
};

export default Show;
