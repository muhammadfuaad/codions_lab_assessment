// import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Space, Card, Avatar, Spin, notification, Tooltip } from 'antd';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router';


const Projects: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  // const users = location.state
  console.log('location.state:', location.state);

  const [totalProjects, setTotalProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token");
  console.log('token:', token);
  // console.log('localStorage:', localStorage);

  const options = {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  
  // project actions
  useEffect(()=>{
    axios.get("https://task-manager.codionslab.com/api/v1/admin/project" , options).then(response => {
      // setLoading(false);
      console.log("(admin projects api) response:", response);
      console.log("(admin projects api) response.data.data:", response.data.data);
      console.log("(admin projects api) response.data.data.data:", response.data.data.data);
      setTotalProjects(response.data.data.data)
      setLoading(false)
    })
    .catch(error => {
      // setError('Please Login');
      setLoading(false);
      console.log("error:", error);
    });
  }, [])

  const deleteProject = (id: number) => {
    console.log(`${id} clicked`);
    setLoading(true)
    axios.delete(`https://task-manager.codionslab.com/api/v1/admin/project/${id}`, options)
      .then(response => {
        const newTotalProjects = totalProjects.filter((project)=>project.id !== id)
        setTotalProjects(newTotalProjects)
        setLoading(false)
        console.log("(delete project api) response:", response);
        notification.success({
          message: 'Project Deleted Successfully',
        });
      })
      .catch(error => {
        console.log("(delete project api) error:", error);
      });
  }

  if (loading) {
    return <Spin size="large" />;
  }
  
  return (
    <>
      <h3>Listed projects: {totalProjects && totalProjects.length}</h3>
      <div>
        <button className="bg-blue-500 text-white" onClick={() => navigate("/new_project")}>
          New Project
        </button>
      </div>
      {totalProjects && totalProjects.map((project)=>{
        const showProject = (id: number) => {
          navigate("/project", {state: {id, token}} )
        }
        const {id, name, description} = project
        const contributors = project.users
        // const nonContributors = users.filter(user => !contributors.some(contributor => contributor.id === user.id));
        // console.log("nonContributors:", (nonContributors));
        
        return (  
          <Space direction="vertical" size={16}>
            <div className='bg-gray-100 p-2 rounded-xl mb-4'>
              <Card title={`${name}`} extra={<a onClick={()=> showProject(id)}>More Details</a>} style={{ width: 300,
                height: "fit-content" }}>
                <p><span className='font-semibold text-md'>Description: </span>{description}</p>
                {contributors.length > 0 &&
                  <p><span className='font-semibold text-md'>Contributors: </span>
                    <Space size={0} wrap>
                      {contributors.map((contributor)=>{
                        return (
                          <Tooltip placement="top" title={contributor.name}>
                            <Avatar size={30} gap={1}>{contributor.name[0]}</Avatar>
                          </Tooltip>
                        )
                      })}
                    </Space>
                  </p>
                }
                <div className='flex items-center justify-center gap-4 mt-8'>
                  <button className="bg-blue-500 text-white" onClick={() => navigate("/edit_project", {state: project})}>
                    Update
                  </button>
                  <button className='bg-red-600 text-white' onClick={() => deleteProject(id)}>
                    Delete
                  </button>
                </div>
              </Card>
            </div>
          </Space>
        )
      })}
    </>
  );
};

export default Projects;
