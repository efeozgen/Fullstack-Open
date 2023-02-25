import { useState } from "react";

const StatisticLine = (props) => {
  //Prints the props values as "text" and "value"
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  );
};

const Statistics = (props) => {
  if (props.all === 0) {
    //Checks if the props is null, if so prints a message
    return <div>No feedback given</div>;
  }
  //Else sends the values to teh StatisticLine
  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={props.good} />
        <StatisticLine text="neutral" value={props.neutral} />
        <StatisticLine text="bad" value={props.bad} />
        <StatisticLine text="all" value={props.all} />
        <StatisticLine text="average" value={props.average} />
        <StatisticLine text="positive" value={props.positive} />
      </tbody>
    </table>
  );
};

const App = () => {
  //useStates
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGood = () => setGood(good + 1); //Increase the value of good by 1
  const handleNeutral = () => setNeutral(neutral + 1); //Increase the value of neutral by 1
  const handleBad = () => setBad(bad + 1); //Increase the value of bad by 1

  //Define consts
  const all = good + neutral + bad;
  const average = (good - bad) / all;
  const positive = (good / all) * 100 + " %";

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={handleGood}>good</button>
      <button onClick={handleNeutral}>neutral</button>
      <button onClick={handleBad}>bad</button>
      <h1>statistics</h1>

      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        average={average}
        positive={positive}
      />
    </div>
  );
};

export default App;
