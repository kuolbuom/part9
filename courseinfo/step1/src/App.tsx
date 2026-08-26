//type declarations for Header
interface HeaderProps {
  name: string;
}
//Header component that takes in props of type HeaderProps and returns a JSX element
const Header = (props: HeaderProps) => {
  console.log("Header props:", props);
  return <h1>{props.name}</h1>;
};

//type declarations for Content
interface ContentProps {
  courseParts: {
    name: string;
    exerciseCount: number;
  }[];
}

//Content component that takes in props of type ContentProps and returns a JSX element
const Content = (props: ContentProps) => {
  console.log("Content props:", props);
  return (
    <div>
      <p>
        {props.courseParts[0].name} {props.courseParts[0].exerciseCount}
      </p>
      <p>
        {props.courseParts[1].name} {props.courseParts[1].exerciseCount}
      </p>
      <p>
        {props.courseParts[2].name} {props.courseParts[2].exerciseCount}
      </p>
    </div>
  );
};

//type declarations for Total
interface TotalProps {
  courseParts: {
    name: string;
    exerciseCount: number;
  }[];
}

//Total component that takes in props of type TotalProps and returns a JSX element
const Total = (props: TotalProps) => {
  console.log("Total props:", props);
  const totalExercises = props.courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0,
  );
  return <p>Number of exercises {totalExercises}</p>;
};

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
    },
  ];

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;
