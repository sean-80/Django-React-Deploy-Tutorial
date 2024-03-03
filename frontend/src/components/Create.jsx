import React from 'react'
import {Box, Button, Typography} from '@mui/material'
import MyDatePickerField from './forms/MyDatePickerField'
import MyMultilineField from './forms/MyMultilineField'
import MySelectField from './forms/MySelectField'
import MyTextField from './forms/MyTextField'
import {useForm} from 'react-hook-form'
import AxiosInstance from './Axios'
import Dayjs from 'dayjs'
import {useNavigate} from 'react-router-dom'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const Create = () => {
  const navigate=useNavigate()
  const defaultValues={
    name:'',
    comments:'',
    status:'',
    start_date:'',
    end_date:'',
  }

  const hardcoded_options = [
    {id:'', name:'None'}, 
    {id:'Open', name:'Open'}, 
    {id:'In progress', name:'In progress'}, 
    {id:'Completed', name:'Completed'}, 
  ]


  const schema = yup
  .object({
    name: yup.string().required("Name is required field"),
    status: yup.string().required("Status is required field"),
    comments: yup.string(),
    start_date: yup.date().required("Start date is required field"),
    end_date: yup.date().required("End date is required field").min(yup.ref('start_date'),'End date cannot be before the start date'),
  })
  .required()

  const {handleSubmit, control}=useForm({defaultValues:defaultValues,resolver:yupResolver(schema)})


  const submission=(data) => {
    const StartDate=Dayjs(data.start_date['$d']).format("YYYY-MM-DD")
    const EndDate=Dayjs(data.end_date['$d']).format("YYYY-MM-DD")
    AxiosInstance.post(`project/`,{
      name:data.name,
      status:data.status,
      comments:data.comments,
      start_date:StartDate,
      end_date:EndDate,
    }
    )
    .then(()=>{
      navigate(`/`)
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit(submission)}>
      <Box sx={{display:'flex',width:'100%', background:'#00003f',marginBottom:'10px'}}>
        <Typography sx={{marginLeft:'20px',color:'#fff'}}>
          Create Records
        </Typography>
      </Box>

      <Box sx={{display:'flex',width:'100%', boxShadow:3 ,padding:4, flexDirection:'column'}}>
        <Box sx={{display:'flex',justifyContent:'space-around', marginBottom:'40px'}}>
          <MyTextField
            label="Name"
            placeholder="Provide project name"
            name="name"
            control={control}
            width={'30%'}
          />

          <MyDatePickerField 
            label="Start date"
            name="start_date"
            control={control}
            width={'30%'}
          />

          <MyDatePickerField 
            label="End date"
            name="end_date"
            control={control}
            width={'30%'}
          />

        </Box>

        <Box sx={{display:'flex',justifyContent:'space-around'}}>
          <MyMultilineField
            label="Comments"
            placeholder="Provide project comments"
            name="comments"
            control={control}
            width={'30%'}
          />

          <MySelectField 
            label="Status"
            name="status"
            control={control}
            width={'30%'}
            options = {hardcoded_options}
          />

          <Box sx={{width:'30%'}}>
            <Button variant='contained' type='submit' sx={{width:'100%'}}>
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
      </form>
    </div>
  )
}

export default Create