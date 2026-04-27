import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button } from '@mui/material';

function CreateForm({ tabName }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    // Handle form submission (e.g., POST to your API)
    console.log(data);
    alert("Form Submitted!");
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField id="field1" label="Field 1" {...register("field1")} />
      <TextField id="field2" label="Field 2" {...register("field2")} />
      {/* Add the remaining 10 fields using TextField and register */}
      <Button type="submit">Submit</Button>
    </form>
  );
}

export default CreateForm;