import React from 'react';
import { Form, Label, Select } from 'semantic-ui-react'
import { useField } from 'formik';
import { CategoryOption } from "../../../app/common/options/categoryOptions";

interface Props {
  placeholder: string;
  options: CategoryOption[];
  name: string;
  label?: string;
}

function MySelectInput(props: Props) {
  const [field, meta, helpers] = useField(props.name);

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>
        {props.label || null}
        <Select 
          clearable
          fluid
          options={props.options}
          name={field.name}
          value={field.value || null}
          onChange={(e,d) => helpers.setValue(d.value)}
          onBlur={() => helpers.setTouched(true)}
          placeholder={props.placeholder}
        />
      </label>

      {meta.touched && meta.error ? (
        <Label basic color="red">{meta.error}</Label>
      ) : null}
    </Form.Field>
  );
};

export default MySelectInput;