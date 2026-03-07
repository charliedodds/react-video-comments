import { render, screen } from "@testing-library/react";
import { ExampleComponent } from "../components/ExampleComponent";

describe("ExampleComponent", () => {
  it("renders the label", () => {
    render(<ExampleComponent label="Hello" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
