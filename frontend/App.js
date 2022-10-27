import "regenerator-runtime/runtime";
import React from "react";

import "./assets/global.css";

import { SignInPrompt, SignOutButton } from "./ui-components";
import { values } from "regenerator-runtime";

export default function App({ isSignedIn, PatientNEAR, wallet }) {
  const [valueFromBlockchain, setValueFromBlockchain] = React.useState();

  const [uiPleaseWait, setUiPleaseWait] = React.useState(true);

  // Get blockchian state once on component load
  React.useEffect(() => {
    PatientNEAR.getPatients()
      .then(setValueFromBlockchain)
      .then(valueFromBlockchain)
      .catch(alert)
      .finally(() => {
        setUiPleaseWait(false);
      });
  }, []);

  /// If user not signed-in with wallet - show prompt
  if (!isSignedIn) {
    // Sign-in flow will reload the page later
    return (
      <SignInPrompt
        patients={valueFromBlockchain}
        onClick={() => wallet.signIn()}
      />
    );
  }

  function createPatient(e) {
    e.preventDefault();
    setUiPleaseWait(true);
    const {
      patientInputName,
      patientInputAge,
      patientInputEmail,
      patientInputDescription,
    } = e.target.elements;

    PatientNEAR.createPatient(
      patientInputName.value,
      patientInputAge.value,
      patientInputEmail.value,
      patientInputDescription.value
    )
      .then(async () => {
        return PatientNEAR.getPatients();
      })
      .then(setValueFromBlockchain)
      .finally(() => {
        setUiPleaseWait(false);
      });
  }
  return (
    <>
      <SignOutButton
        accountId={wallet.accountId}
        onClick={() => wallet.signOut()}
      />
      <main className={uiPleaseWait ? "please-wait" : ""}>
        {valueFromBlockchain &&
          valueFromBlockchain?.map((value) => (
            <div>
              <h1>Patient info</h1>
              <p>
                Name: <span className="patient">{value?.name}</span>
              </p>
              <p>
                Age: <span className="patient">{value?.age}</span>
              </p>
              <p>
                Email:
                <span className="patient">{value?.email}</span>
              </p>
              <p>
                Description:
                <span className="patient">{value?.description}</span>
              </p>
            </div>
          ))}
        <form onSubmit={createPatient} className="change">
          <label>Create patient info:</label>
          <input
            autoComplete="off"
            id="patientInputName"
            name="patientInputName"
            placeholder="Name"
          />
          <input
            autoComplete="off"
            id="patientInputAge"
            name="patientInputAge"
            placeholder="Age"
          />
          <input
            autoComplete="off"
            id="patientInputEmail"
            name="patientInputEmail"
            placeholder="Email"
          />
          <input
            autoComplete="off"
            id="patientInputDescription"
            name="patientInputDescription"
            placeholder="Description"
          />
          <button>
            <span>Save</span>
            <div className="loader"></div>
          </button>
        </form>
      </main>
    </>
  );
}
