import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Alert, Button, notification, Card, Space, Tag, Avatar, Dropdown } from 'antd';
import { useNavigate } from 'react-router';
// import { DownOutlined } from '@ant-design/icons';

interface UserData {
  id: number;
  name: string;
  email: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const savedToken = localStorage.getItem("token");
  console.log('savedToken:', savedToken);
  const options = {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${savedToken}`,
    },
  };

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [users, setUsers] = useState<Users | null>(null);

  const [pageUrl, setPageUrl] = useState(null)
  const [totalProjects, setTotalProjects] = useState([])
  const [assignedProjects, setAssignedProjects] = useState([])
  
  // project actions
  const showProject = (id: number) => {
    navigate("/project_details", {state: {id, savedToken}} )
  }

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
    const isUpdate = true
    navigate("/project_details", {state: {id, savedToken, isUpdate}} )
  }

    // user actions
  const deleteUser = (id: number) => {
    console.log(`${id} clicked`);
    axios.delete(`https://task-manager.codionslab.com/api/v1/admin/user/${id}`, options)
    .then(response => {
      console.log("response:", response);
    })
    .catch(error => {
      console.log("error:", error);
    });
  }

  const updateUser = (id) => {
    console.log(`${id} clicked`);
    const user = users.find((user)=> user.id === id)
    const isUserEdit = true
    navigate("/update", { state: {id: user.id, name: user.name, email: user.email, password: user.password, role: user.role,
      is_active: user.is_active, token: savedToken, options, isUserEdit} });
  }

  const handleUpdate = () => {
    const isEdit = true
    navigate("/update", { state: {userData, isEdit} });
  }

  useEffect(() => {
    // it fetches user data
    axios.get('https://task-manager.codionslab.com/api/v1/profile', options)
    .then(response => {
      setLoading(false);
      console.log("response:", response);
      console.log("response.data.data:", response.data.data);
      setUserData(response.data.data);
    })
    .catch(error => {
      setError('Please Login');
      setLoading(false);
      console.log("error:", error);
    });

    // It fetches the projects assigned to user
    axios.get('https://task-manager.codionslab.com/api/v1/project', options)
    .then(response => {
      // setLoading(false);
      console.log("(user projects) response:", response);
      console.log("(user projects) response.data.data:", response.data.data);
      // setUserData(response.data.data);
      const firstPageUrl = response.data.data.first_page_url;
      console.log("firstPageUrl:", firstPageUrl);
      setPageUrl(firstPageUrl)
      setAssignedProjects(response.data.data.data)

      // axios.get("https://task-manager.codionslab.com/api/v1/project?page=1" , options).then(response => {
      //   // setLoading(false);
      //   console.log("3rd response:", response);
      //   console.log("3rd response.data.data:", response.data.data);
      //   console.log("3rd response.data.data.data:", response.data.data.data);
      //   setProjects(response.data.data.data)
      // })
      // .catch(error => {
      //   // setError('Please Login');
      //   setLoading(false);
      //   console.log("error:", error);
      // });
    })
    .catch(error => {
      // setError('Please Login');
      setLoading(false);
      console.log("error:", error);
    });

    // It fetches the all the registered users
    axios.get("https://task-manager.codionslab.com/api/v1/admin/user" , options).then(response => {
      // setLoading(false);
      console.log("(users index api) response:", response);
      console.log("(users index api) response.data.data:", response.data.data);
      console.log("(users index api) response.data.data.data:", response.data.data.data);
      setUsers(response.data.data.data)

      // setProjects(response.data.data.data)

    })
    .catch(error => {
      // setError('Please Login');
      setLoading(false);
      console.log("error:", error);
    });

    // It fetches the all the registered projects
    axios.get("https://task-manager.codionslab.com/api/v1/admin/project" , options).then(response => {
      // setLoading(false);
      console.log("(admin projects api) response:", response);
      console.log("(admin projects api) response.data.data:", response.data.data);
      console.log("(admin projects api) response.data.data.data:", response.data.data.data);
      setTotalProjects(response.data.data.data)
    })
    .catch(error => {
      // setError('Please Login');
      setLoading(false);
      console.log("error:", error);
    });
  }, []);

  useEffect(() => {
    console.log("userData:", userData);
    console.log("totalProjects:", totalProjects);
    console.log("assignedProjects:", assignedProjects);

  }, [userData]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    }
  ];

  const columns2 = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Roles',
      key: 'role',
      dataIndex: 'role',
      render: (role) => (
        <Tag color={(role == "admin") ? "#f50" : "#2db7f5"}>{role.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => deleteUser(record.id)}>
            Delete
          </Button>
          <Button type="primary" onClick={() => updateUser(record.id)}>
            Update
          </Button>
        </>
      ),
    }
  ];

  const dataSource1 = userData ? [userData] : [];
  
  const handleLogOut = () => {
    axios.post('https://task-manager.codionslab.com/api/v1/logout', {},  options)
      .then(response => {
        console.log("response:", response);
        notification.success({
          message: 'Logged Out Successfully',
        });
        navigate("/login")
      })
      .catch(error => {
        console.log("error:", error);
      });
      return <Alert message="Logged Out Succesfully" description={error} type="error" showIcon />;
  }

  return (
    <>
      <h3>Your Details</h3>
      <Table dataSource={dataSource1} columns={columns} rowKey="id" />
      <Button type="primary" onClick={handleUpdate}>
        Update Your Details
      </Button>
      <Button type="primary" onClick={handleLogOut}>
        Log Out
      </Button>
      <p>There are {assignedProjects.length} projects assigned to you.</p> 
      {assignedProjects && assignedProjects.map((project)=> 
        {const {name, description} = project
          return ( 
            <>
              <p><span className='font-bold bg-black'>Id: </span>{project.id}</p>
              <p><span>Name: </span>{name}</p>
              <p><span>Description: </span>{description}</p>
            </>
          )
        })
      }

      {userData.role == "admin" && 
        <>
          <h3>Registered Users: {users && users.length}</h3>
          <Table dataSource={users} columns={columns2} rowKey="id" />
        </>
      }

      <h3>Listed projects: {totalProjects && totalProjects.length}</h3>
      <Button type="primary" onClick={() => navigate("/projects/new")}>
        New Project
      </Button>
      {totalProjects && totalProjects.map((project)=>{
        const {id, name, description} = project
        const contributors = project.users
        // const projectAssignees = users.map((user)=>user.name)
        // console.log("projectAssignees:", (projectAssignees));
        // console.log("users:", (users));

        
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
                
              </p>
              <Button type="primary" onClick={() => updateProject(id)}>
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

export default Profile;
