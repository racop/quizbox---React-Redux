export const formSchema = [
  {
    name: "min",
    placeholder: "Enter min limit...",
    type: "number",
    min: 1,
    label: "Enter min limit",
  },
  {
    name: "max",
    placeholder: "Enter max limit...",
    type: "number",
    min: 1,
    label: "Enter max limit",
  },
  {
    name: "qNumber",
    placeholder: "Enter number of questions...",
    type: "number",
    min: 1,
    label: "Number of Questions",
  },
  {
    name: "timer",
    placeholder: "Enter question timer...",
    type: "number",
    min: 2,
    label: "Question timer",
    addonAfter: "seconds",
  },
  {
    name: "operator",
    type: "multi-select",
    label: "Select operator",
    placeholder: "Select operators...",
    options: [
      { label: "+", value: "plus" },
      { label: "-", value: "minus" },
      { label: "/", value: "divide" },
      { label: "x", value: "multiply" },
    ],
  },
];
