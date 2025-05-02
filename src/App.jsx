import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';


export default function App() {
  const notify = ( msg , flag ) => toast(msg,{type:flag ? "success" : "error"});

  const [users , setusers] =  useState([]);
  const [userdetail , setuserdetail ] = useState(null);

  function fetchdata (){
    axios.get("http://localhost:5000/user/get-data").then(
      (response)=>{
     setusers(response.data.users);
      }
    ).catch(
      (error)=>{
 console.log(error)
 setusers([]);
      }
    )
  }

useEffect(
  ()=>{
    fetchdata();
  },[]
)


  const submithandler = (event) =>{
    event.preventDefault()
    const data ={
      name : event.target.name.value,
      email : event.target.email.value,
      contact : event.target.contact.value,
    }

    let API = null ;  
    if (userdetail == null){
      API = axios.post("http://localhost:5000/user/create",data)
    }else{
      API = axios.put("http://localhost:5000/user/update/" + userdetail._id ,data)
    }

    console.log(API)

     API.then(
      (response)=>{
        notify(response.data.msg , response.data.flag)
         if(response.data.flag==1 ){
          fetchdata();
         }
      }
     ).catch(
      (error)=>{
    console.log(error)
      }
     )
     
  }

  function deletehandler(id) {
axios.delete("http://localhost:5000/user/delete/"+id).then(
  (response)=>{
      notify(response.data.msg , response.data.flag)
      // if(response.data.flag){
      // }
      fetchdata()
    }

).catch(
  (error)=>{
console.log(error)
  }
)
  }

  function statushandler (id){
    axios.patch(`http://localhost:5000/user/status/${id}`).then(
      (response)=>{
        notify(response.data.msg,response.data.flag)
       if(response.data.flag===1){

         fetchdata()
       }
      }
    ).catch(
      (error)=>{
  console.log(error)
      }
    )
  }

  return (
    <>
        <div className="flex flex-col md:flex-row gap-4 p-4">
        <ToastContainer />
      
      {/* Left Side: Form */}
      <div className="w-full md:w-80 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">User Form</h2>
        <form onSubmit={submithandler}  className="space-y-5  shadow-2xl p-5">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={userdetail?.name}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={userdetail?.email}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">contact</label>
            <input
              type="contact"
              name="contact"
              defaultValue={userdetail?.contact}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter contact"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Right Side: Table */}
      <div className="w-full md:w-6xl bg-white p-6 rounded shadow overflow-auto">
        <h2 className="text-xl font-semibold mb-4">User List</h2>
        <table className="min-w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">S.no</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">contact</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
          {
            users.map(
              (data , index)=>{
                return(
                  <tr>
              <td className="px-4 py-2 border"> {index + 1} </td>
              <td className="px-4 py-2 border"> {data.name} </td>
              <td className="px-4 py-2 border">{data.email}</td>
              <td className="px-4 py-2 border">{data.contact}</td>
              <td className="px-4 py-2 border">
              <button
          className={`  ${data.status ? "bg-green-500" : "bg-red-500" } text-white px-3 py-1 rounded hover:bg-yellow-600`}
          onClick={()=>statushandler(data._id)}
        >
         {
          data.status ?
          "Active"
          :
          "inactive"
         }
        </button>
              </td>
              
              <td className="px-4 py-2 border flex gap-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      onClick={()=>setuserdetail(data)}
                    >
                      Edit
                    </button>
                    <button
                    onClick={() => deletehandler(data._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
              </tr>
              )
              }
            )
          }
            
          </tbody>
        </table>
      </div>
      
    </div>

    </>
  )
}
