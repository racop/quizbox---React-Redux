export const useQuizBox = () => {
  const getCorrectAnswer = (x, y, operator) => {
    switch (operator) {
      case "minus":
        return x - y;
      case "divide":
        return x / y;
      case "multiply":
        return x * y;
      default:
        return x + y;
    }
  };
  const getOperator = (o) => {
    switch (o) {
      case "minus":
        return "-";
      case "divide":
        return "/";
      case "multiply":
        return "*";
      default:
        return "+";
    }
  };
  return { getCorrectAnswer, getOperator };
};
