// import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Spin, notification } from 'antd';
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';


const Show: React.FC = () => {
  const [projectData, setProjectData] = useState({})
  const [loading, setLoading] = useState<boolean>(true)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  // const [updatedDescription, setUpdatedDescription] = useState("")

  const {name, description, is_active} = projectData
  const location = useLocation()
  const id = location.state.id
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
    axios.get(`https://task-manager.codionslab.com/api/v1/project/${id}`, options)
    .then(response => {
      setProjectData(response.data.data)
      setLoading(false)
    })
    .catch(error => {
      setLoading(false);
      console.log("error:", error);
    });
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

  if (loading) {
    return <Spin size="large" />;
  }
  
  return (
    <>
      <Card title={`${id}) ${name}`} style={{ width: 300, height: "fit-content" }}>
        <p>{isEdit ? <textarea defaultValue={description} onChange={(e) => {
            console.log("projectData:", projectData);
            setProjectData({...projectData,description: e.target.value})
          }
          
        }></textarea>
          : description}</p>
        <Button type="primary" onClick={() => updateProject(id)}>
          {isEdit ? "Save Changes" : "Update"}
        </Button>
        <Button type="primary" onClick={() => deleteProject(id)}>
          Delete
        </Button>
      </Card>
    </>
  );
};

export default Show;
