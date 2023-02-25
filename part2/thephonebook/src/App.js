import { useState, useEffect } from "react";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import ErrorNotification from "./components/ErrorNotification";
import SuccessNotification from "./components/SuccessNotification";
import axios from "axios";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response);
    });
  }, []);

  //Deletes a Person
  const deletePerson = (id) => {
    const person = persons.filter((n) => n.id === id);

    if (window.confirm(`Delete ${person[0].name} ?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter((n) => n.id !== id));
        setNewName("");
        setNewNumber("");
      });
    }
  };

  //Follows the change in name
  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  //Follows the change in number
  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  //Follos the change şn filter
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  //Adds a Person
  const addPerson = (event) => {
    event.preventDefault();

    //Define a personObject
    const personObject = {
      name: newName,
      number: newNumber,
    };

    //Checks if name or number is empty, if so prints a message
    if (newName === "" || newNumber === "") {
      window.alert(`Please enter name and number`);
    } else {
      //Checks if the name has already in the phonebook
      if (
        persons.filter((person) => person.name === personObject.name).length > 0
      ) {
        //Ask if the old number should change with the new one
        if (
          window.confirm(
            `${newName}  is already added the phonebook, replace the old number with a new one ? `
          )
        ) {
          const person = persons.find((n) => n.name === newName);

          //Updates the number
          personService
            .update(person.id, { ...person, number: newNumber })
            .then((returnedPerson) => {
              //If no error occurs, prints the success message
              setPersons(
                persons.map((n) => (n.name === newName ? returnedPerson : n))
              );
              setSuccessMessage(`"${newName}"s number is updated`);
              setNewName("");
              setNewNumber("");
              setTimeout(() => {
                setSuccessMessage(null);
              }, 3000);
            })
            .catch((error) => {
              //If an error occurs, prints the error message
              setErrorMessage(
                `[ERROR]: Person is not found, might have been deleted`
              );
              setTimeout(() => {
                setErrorMessage(null);
              }, 3000);
            });
        }
      } else {
        //Creates a new personObject
        personService
          .create(personObject)
          .then((newPerson) => {
            //If no error occurs, prints the success message
            setPersons(persons.concat(newPerson));
            setSuccessMessage(`Person succesfully added`);
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            //If an error occurs, prints an error message
            setErrorMessage(`${error.response.data.error}`);
          });
        setTimeout(() => {
          setErrorMessage(null);
          setSuccessMessage(null);
        }, 3000);
      }
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <ErrorNotification errorMessage={errorMessage} />
      <SuccessNotification successMessage={successMessage} />
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        newFilter={newFilter}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;
