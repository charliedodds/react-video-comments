import { type FC } from "react";

export interface ExampleComponentProps {
  label: string;
}

export const ExampleComponent: FC<ExampleComponentProps> = ({ label }) => {
  return <div>{label}</div>;
};
