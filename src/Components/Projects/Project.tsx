import axios from 'axios';
import { Card, Button, Spin, notification, Space, Avatar, Tooltip, Input } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

const Project: React.FC = () => {
  const [project, setProject] = useState({})
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [comments, setComments] = useState([])
  const [content, setContent] = useState("")
  const users = localStorage.getItem("users")
  const [showInput, setShowInput]  = useState(false)
  const navigate = useNavigate()

  const {name, description, is_active} = project
  const location = useLocation()
  const id = location.state.id
  const projectId = location.state.id

  const token = location.state.token
  
  console.log("isEdit:", isEdit);
  console.log("location.state.isUpdate:", location.state.isUpdate);

  
  const options = {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  // comment actions
  const addComment = (id) => {
    axios.post(`https://task-manager.codionslab.com/api/v1/project/${projectId}/task/${id}/comment`, 
    {content, parent_id: null}, options)
    .then((response)=>{console.log("response:", response)})
    .catch((error)=>{console.log("error:", error);
    })
  }

  const deleteComment = (id, taskId) => {
    console.log("id:", id);
    console.log("taskId:", taskId);
    axios.delete(`https://task-manager.codionslab.com/api/v1/project/${projectId}/task/${taskId}/comment/${id}`, options)
    .then((response)=>{
      console.log(response);
      const newComments = comments.filter((comment)=>comment.id === id)
      console.log("newComments:", newComments);
      
      setComments(newComments)
    }).catch((error)=>{console.log(error);
    })
  }

  useEffect(()=>{
    if (location && location.state.isUpdate) {
      setIsEdit(true)
    }
    axios.get(`https://task-manager.codionslab.com/api/v1/project/${projectId}`, options)
    .then(response => {
      setProject(response.data.data)
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
      console.log("response.data.data:", response.data.data);
      console.log("response.data.data.id:", response.data.data.id);
      (response.data.data).forEach(task => {
        const taskId = task.id
        console.log("taskId:", taskId);
        axios.get(`https://task-manager.codionslab.com/api/v1/project/${projectId}/task/${taskId}/comment`, options).then(
          (response)=>{console.log("response:", response);
            setComments((prevComments)=>[...prevComments, {taskId: taskId, comments: response.data.data}])
        }).catch((error)=>{console.log("error:", error);
        })
      });
    })
    .catch(error => {
      console.log("error:", error);
    });
    console.log("tasks:", tasks);
  }, [])

  useEffect(()=>{
    console.log("comments:", comments);
  }, [comments])

  const deleteProject = (id: number) => {
    console.log(`${id} clicked`);
    setLoading(true)
    axios.delete(`https://task-manager.codionslab.com/api/v1/admin/project/${id}`, options)
      .then(response => {
        setLoading(false)
        navigate("/projects")
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
    setLoading(true)
    axios.delete(`https://task-manager.codionslab.com/api/v1/project/${id}/task/${taskId}`, options)
    .then(response => {
      setLoading(false)
      const newTasks = tasks.filter((task)=>task.id !== taskId)
      setTasks(newTasks)
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
  
  const contributors = project.users
  console.log("project:", project);

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
      <Card title={`${id}) ${name}`} style={{ width: 600,
        height: "fit-content" }}>
        <p className='text-md'><span className='font-bold'>Description: </span>{description}</p>
        <p className='mt-8'><span className='font-bold text-md'>Contributors: </span>
          {contributors && contributors.length == 0 && "There is no contributor for this project"}
          <Space size={0} wrap>
            {contributors && contributors.map((contributor)=>{
              return ( 
                <>
                  <Tooltip placement="top" title={contributor.name}>
                    <Avatar size={30} gap={1}>{contributor.name[0]}</Avatar>
                  </Tooltip>
                </>
              )
            })} 
          </Space>
        </p>
        <h3 className='font-bold text-lg mt-6'>Tasks: <span className='font-normal'>{tasks.length == 0 ? "No task is added to this project" : tasks.length}</span></h3>
        <Button type="primary" onClick={() => navigate("/new_task", {state: projectId})}>
            New Task
          </Button>
        <div className='flex flex-col gap-4'>
          {tasks.map((task)=>{
            const {id, name, description, due_date, assignee_id, status, created_at, updated_at } = task
            console.log("task:", task)
            const taskId = id
            const newTask = {...task, due_date: formatDate(due_date), created_at: formatDate(created_at),
            updated_at: formatDate(updated_at)}
            return (
              <div className='bg-gray-100 p-12 rounded-xl'>
                <h4><span className='inline font-bold'>Task Id: </span>{id}</h4>
                <h4><span className='inline font-bold'>Description: </span>{description}</h4>
                <h4><span className='inline font-bold'>Added By: </span>{name}</h4>
                <h4><span className='inline font-bold'>Contributors: </span>{assignee_id}</h4>
                <h4><span className='inline font-bold'>Status: </span>{status}</h4>
                <h4><span className='inline font-bold'>Added at: </span>{formatDate(created_at)}</h4>
                <h4><span className='inline font-bold'>Updated at: </span>{formatDate(updated_at)}</h4>
                <h4><span className='inline font-bold'>Due date: </span>{formatDate(due_date)}</h4>
                <h3>
                  <span className='inline font-bold text-blue-600'>Comments: </span> 
                  {comments.find((item)=>item.taskId === id)?.comments.length}
                </h3>
                {comments.find((item)=>item.taskId === id)?.comments.map((comment)=>{
                  const {content, id} = comment
                  return ( 
                    <div className='flex gap-2'>
                      <span>{content}</span><span className='text-blue-600'>{comment.user_id}</span>
                      <span className='text-red-600 cursor-pointer' onClick={()=>{deleteComment(id, taskId)}}>Delete</span>
                    </div>
                  )
                  })}
                <Button type="primary" onClick={()=>{setShowInput(true)}}>New Comment</Button>
                {showInput && 
                  <div>
                    <Input onChange={(e)=>{setContent(e.target.value)}}></Input> 
                    <Button onClick={()=>{addComment(id)}}>Post</Button>
                  </div>
                }
                <div className='flex items-center justify-center gap-4 mt-8'>
                  <button className="bg-blue-500 text-white" onClick={() => navigate("/edit_task", 
                    {state: {newTask, projectId}})}>
                    Update Task
                  </button>
                  <button className='bg-red-600 text-white' onClick={() => deleteTask(id)}>
                    Delete Task
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        <div className='flex gap-4 my-12 justify-center items-center'>
          <button className="bg-blue-500 text-white" onClick={() => navigate("/edit_project", {state: project})}>
            Update Project
          </button>
          <button className='bg-red-600 text-white' onClick={() => deleteProject(id)}>
            Delete Project
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Project;