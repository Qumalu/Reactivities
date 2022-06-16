import React from "react";
import { FieldRenderProps } from "react-final-form";
import { TimeInput } from "react-widgets/cjs";
import { Form, FormFieldProps, Label } from "semantic-ui-react";

interface IProps extends FieldRenderProps<Date>, FormFieldProps {}

const MyTimeInput: React.FC<IProps> = ({
  input,
  width,
  type,
  placeholder,
  meta: { touched, error },
  id,
  date = false,
  time = false,
  ...rest
}) => {
  return (
    <Form.Field error={touched && !!error} type={type} witdh={width}>
      <TimeInput
        id={id ? id.toString() : ""}
        placeholder={placeholder}
        value={input.value || null}
        onChange={input.onChange}
        onBlur={input.onBlur}
        {...rest}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default MyTimeInput;
