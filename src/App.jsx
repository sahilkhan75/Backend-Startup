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
              <ToastContainer />
      {/* Left Side: Form */}
      <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
  {/* User Form */}
  <div className="w-full md:w-1/3 bg-white p-6 rounded-xl shadow-lg border">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">📝 Add / Edit User</h2>
    <form onSubmit={submithandler} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-gray-600 font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          defaultValue={userdetail?.name}
          placeholder="John Doe"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {/* Email */}
      <div>
        <label className="block text-gray-600 font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          defaultValue={userdetail?.email}
          placeholder="john@example.com"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {/* Contact */}
      <div>
        <label className="block text-gray-600 font-medium mb-1">Contact</label>
        <input
          type="text"
          name="contact"
          defaultValue={userdetail?.contact}
          placeholder="+91 9876543210"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {/* Submit */}
      <button
        type="submit"
        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-300"
      >
        Submit
      </button>
    </form>
  </div>

  {/* User Table */}
  <div className="w-full md:flex-1 bg-white p-6 rounded-xl shadow-lg border overflow-auto">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">📋 User List</h2>
    <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
      <thead className="text-gray-600 uppercase tracking-wider bg-gray-100">
        <tr>
          <th className="px-4 py-2">S.No</th>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Contact</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {users.map((data, index) => (
          <tr key={data._id} className="bg-white shadow-sm rounded-lg">
            <td className="px-4 py-2">{index + 1}</td>
            <td className="px-4 py-2">{data.name}</td>
            <td className="px-4 py-2">{data.email}</td>
            <td className="px-4 py-2">{data.contact}</td>
            <td className="px-4 py-2">
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                  data.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {data.status ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-4 py-2 space-x-2">
              <button
                onClick={() => setuserdetail(data)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-xs"
              >
                Edit
              </button>
              <button
                onClick={() => deletehandler(data._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
      </>
  )
}
