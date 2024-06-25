// import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Spin, notification, Space, Avatar, Select } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

const Project: React.FC = () => {
  const [projectData, setProjectData] = useState({})
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isEdit, setIsEdit] = useState<boolean>(false)

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
      console.log("response.data.data:", response.data.data);
      
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
  console.log("projectData:", projectData);

  console.log("contributors:", contributors);
  
  // const nonContributors = users.filter(user => !contributors.some(contributor => contributor.id === user.id));

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
  
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      // hour: '2-digit',
      // minute: '2-digit',
      // second: '2-digit',
      // timeZoneName: 'short'
    };
  
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  
  return (
    <div className='bg-gray-100 rounded-xl'>
      <Card title={`${name}`} style={{ width: 600,
        height: "fit-content" }}>
        <p><span className='font-semibold text-md'>Description: </span>{description}</p>
        <p className='mt-8'><span className='font-semibold text-md'>Contributors: </span>
          {contributors.length == 0 && "There is no contributor for this project"}
          <Space size={16} wrap>
            {contributors && contributors.map((contributor)=>{
              return ( 
                <>
                  <Avatar size={30} gap={2}>{contributor.name}</Avatar>
                </>
              )
            })} 
          </Space>
        </p>
        <h3 className='font-semibold text-md mt-12'>Tasks: {tasks.length ==0 && <span className='font-normal'>No task is added to this prject</span>}</h3>
        <Button type="primary" onClick={() => navigate("/new_task", {state: projectId})}>
            New Task
          </Button>
        <div className='flex flex-col gap-4'>
          {tasks.map((task)=>{
            const {id, name, description, due_date, assignee_id, status, created_at, updated_at } = task
            const newTask = {...task, due_date: formatDate(due_date), created_at: formatDate(created_at),
            updated_at: formatDate(updated_at)}
            return (
              <div className='bg-gray-100 p-12 rounded-xl'>
                <div><h4 style={{display: "inline"}}>Task Id: </h4>{id}</div>
                <div><h4 style={{display: "inline"}}>Description: </h4>{description}</div>
                <div><h4 style={{display: "inline"}}>Added By: </h4>{name}</div>
                <div><h4 style={{display: "inline"}}>Contributors: </h4>{assignee_id}</div>
                <div><h4 style={{display: "inline"}}>Status: </h4>{status}</div>
                <div><h4 style={{display: "inline"}}>Added at: </h4>{formatDate(created_at)}</div>
                <div><h4 style={{display: "inline"}}>Updated at: </h4>{formatDate(updated_at)}</div>
                <div><h4 style={{display: "inline"}}>Due date: </h4>{formatDate(due_date)}</div>
                <div className='flex items-center justify-center gap-4 mt-8'>
                  <Button type="primary" onClick={() => navigate("/edit_task", {state: {newTask, projectId}})}>
                    Update Task
                  </Button>
                  <Button type="primary" onClick={() => deleteTask(id)}>
                    Delete Task
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
        <div className='flex gap-4 my-12 justify-center items-center'>
          <Button type="primary" onClick={() => navigate("/projects/new", {state: projectData})}>
            Update Project
          </Button>
          <Button type="primary" onClick={() => deleteProject(id)}>
            Delete Project
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Project;