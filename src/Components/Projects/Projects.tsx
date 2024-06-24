// import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Space, Card, Avatar, Select, Spin } from 'antd';
import { useLocation } from 'react-router';


const Projects: React.FC = () => {
  const location = useLocation()
  const users = location.state
  console.log('location.state:', location.state);

  const [totalProjects, setTotalProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const savedToken = localStorage.getItem("token");
  console.log('savedToken:', savedToken);
  // console.log('localStorage:', localStorage);

  const options = {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${savedToken}`,
    },
  };
  
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

  if (loading) {
    return <Spin size="large" />;
  }
  
  return (
    <>
      <h3>Listed projects: {totalProjects && totalProjects.length}</h3>
      <Button type="primary" onClick={() => navigate("/projects/new")}>
        New Project
      </Button>
      {totalProjects && totalProjects.map((project)=>{
        const showProject = (id: number) => {
          navigate("/project_details", {state: {id, savedToken}} )
        }
        const {id, name, description} = project
        const contributors = project.users
        const handleChange = (value) => {
          console.log(`Selected: ${value}`);
        }
        const nonContributors = users.filter(user => !contributors.some(contributor => contributor.id === user.id));
        console.log("nonContributors:", (nonContributors));
        
        return (  
          <Space direction="vertical" size={16}>
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
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Select non-contributors"
                  onChange={handleChange}
                >
                  {nonContributors.map(nonContributor => (
                    <Option key={nonContributor.id} value={nonContributor.name}>
                      {/* {nonContributor.username} */}
                    </Option>
                  ))}
                </Select>
                
              </p>
              <Button type="primary" onClick={() => showProject(id)}>
                Update
              </Button>
              <Button type="primary" onClick={() => deleteProject(id)}>
                Delete
              </Button>
            </Card>
          </Space>
        )
      })}
    </>
  );
};

export default Projects;
