// import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { Table, Spin, Alert } from 'antd';


const Projects: React.FC = () => {
 
  axios.get('https://task-manager.codionslab.com/api/v1/project')
      .then(response => {
        console.log("response:", response);
        console.log("response.data.data:", response.data.data);
      })
      .catch(error => {
        // setError('Please Login');
        // setLoading(false);
        console.log("error:", error);
      });
  return (
    <>
      {/* <Table dataSource={dataSource} columns={columns} rowKey="id" />
      <button onClick={handleLogOut}>Log Out</button> */}
    </>
  );
};

export default Projects;
